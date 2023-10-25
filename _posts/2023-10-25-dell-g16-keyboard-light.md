---
layout: post
title: Dell G16 在 Linux 下设置键盘灯 （逆向）
categories: [Curiosity]
---

Dell G16 这个笔记本是有彩色键盘灯的， 但是设置键盘灯的设置程序是 C# 写的， 只能跑在 Windows 下， Linux 用户就没法享用这个酷炫的键盘。

今天超级感动的是， 好友 [smallevilbeast](https://gist.github.com/smallevilbeast) 直接去了 Dell 店逆向了 Windows 键盘设置程序的 USB 协议， 还专门给我写了一段[代码](https://gist.github.com/smallevilbeast/404cf7402b2ad382a8a05e193cee9808)， 让我可以在 Linux 下随意设置 Dell 的键盘灯, 下面是折腾的方法。

### 安装依赖

```bash
sudo pip3 install pyusb
```

### 添加设备权限
新建文件 /etc/udev/rules.d/10-alienfx.rules, 内容如下:
```
SUBSYSTEM=="usb", ATTR{idVendor}=="0d62", ATTR{idProduct}=="ccbc", MODE:="666", GROUP="users"
```
上面这段配置的目的是让你可以在没有 root 权限的情况下直接访问 udev 设备。

执行下面的命令重新加载 udev 规则:

```bash
sudo udevadm control --reload-rules
sudo udevadm trigger

```

### 测试代码

```python
import logging
import time

import usb
from usb import USBError


class AlienwareUSBDriver:
    VENDOR_ID = 0xd62           # 这个表示 Dell 这个生产厂商
    PRODUCT_ID = 0xccbc         # 这个是键盘的产品型号， 外星人 M16 和 Dell G16 的按键是一样的， 主要是这个型号不一样

    SEND_BM_REQUEST_TYPE = 0x21
    SEND_B_REQUEST = 0x09
    SEND_W_VALUE = 0x3cc
    SEND_W_INDEX = 0x0

    def __init__(self):
        self._control_taken = False
        self._device = None

    def acquire(self):
        """ Acquire control of the USB controller."""
        if self._control_taken:
            return

        self._device = usb.core.find(idVendor=AlienwareUSBDriver.VENDOR_ID, idProduct=AlienwareUSBDriver.PRODUCT_ID)

        if self._device is None:
            logging.error("ERROR: No AlienFX USB controller found; tried VID {}, PID {}"
                          .format(AlienwareUSBDriver.VENDOR_ID, AlienwareUSBDriver.PRODUCT_ID))

        try:
            self._device.detach_kernel_driver(0)
        except USBError as exc:
            logging.error("Cant detach kernel driver. Error : {}".format(exc.strerror))

        try:
            self._device.set_configuration()
        except USBError as exc:
            logging.error("Cant set configuration. Error : {}".format(exc.strerror))

        try:
            usb.util.claim_interface(self._device, 0)
        except USBError as exc:
            logging.error("Cant claim interface. Error : {}".format(exc.strerror))

        self._control_taken = True
        logging.debug("USB device acquired, VID={}, PID={}".format(hex(AlienwareUSBDriver.VENDOR_ID),
                                                                   hex(AlienwareUSBDriver.PRODUCT_ID)))

    def release(self):
        if not self._control_taken:
            return

        try:
            usb.util.release_interface(self._device, 0)
        except USBError as exc:
            logging.error("Cant release interface. Error : {}".format(exc.strerror))

        try:
            self._device.attach_kernel_driver(0)
        except USBError as exc:
            logging.error("Cant re-attach. Error : {}".format(exc.strerror))

        self._control_taken = False
        logging.debug("USB device released, VID={}, PID={}".format(hex(AlienwareUSBDriver.VENDOR_ID),
                                                                   hex(AlienwareUSBDriver.PRODUCT_ID)))

    def write_packet(self, pkt):
        if not self._control_taken:
            return

        try:
            num_bytes_sent = self._device.ctrl_transfer(
                self.SEND_BM_REQUEST_TYPE, self.SEND_B_REQUEST,
                self.SEND_W_VALUE, self.SEND_W_INDEX,
                pkt, 0)

            logging.debug("wrote: {}, {} bytes".format(pkt, len(pkt)))
            if len(pkt) != num_bytes_sent:
                logging.error("writePacket: intended to write {} of {} bytes but wrote {} bytes"
                              .format(pkt, len(pkt), num_bytes_sent))

            return num_bytes_sent
        except USBError as exc:
            logging.error("writePacket: {}".format(exc))


KEYMAP = {
    'esc': 1, 'f1': 2, 'f2': 3, 'f3': 4, 'f4': 5, 'f5': 6, 'f6': 7, 'f7': 8, 'f8': 9, 'f9': 0xa, 'f10': 0xb,
    'f11': 0xc, 'f12': 0xd, 'home': 0xe, 'end': 0xf,
    'del': 0x10, '`': 0x15, '1': 0x16, '2': 0x17, '3': 0x18, '4': 0x19, '5': 0x1a, '6': 0x1b, '7': 0x1c, '8': 0x1d,
    '9': 0x1e, '0': 0x1f, '-': 0x20, '=': 0x21,
    'back': 0x24, 'microphone': 0x14, 'tab': 0x29, 'q': 0x2b, 'w': 0x2c, 'e': 0x2d, 'r': 0x2e, 't': 0x2f, 'y': 0x30,
    'u': 0x31, 'i': 0x32, 'o': 0x33, 'p': 0x34,
    '[': 0x35, ']': 0x36, '\\': 0x38, 'voice0': 0x11, 'caps': 0x3e, 'a': 0x3f, 's': 0x40, 'd': 0x41, 'f': 0x42,
    'g': 0x43, 'h': 0x44, 'j': 0x45, 'k': 0x46,
    'l': 0x47, ';': 0x48, '\'': 0x49, 'enter': 0x4b, 'voice+': 0x13, 'lshift': 0x52, 'z': 0x54, 'x': 0x55,
    'c': 0x56, 'v': 0x57, 'b': 0x58, 'n': 0x59, 'm': 0x5a,
    ',': 0x5b, '.': 0x5c, '/': 0x5d, 'rshift': 0x5f, 'up': 0x73, 'voice-': 0x12, 'lctrl': 0x65, 'fn': 0x66,
    'lwin': 0x68, 'lalt': 0x69, 'space': 0x6a, 'ralt': 0x70,
    'rwin': 0x6e, 'rctrl': 0x71, 'left': 0x86, 'down': 0x87, 'right': 0x88
}

def get_key_bytes(a, b, a_color, b_color):
    header = bytes.fromhex('cc8c0200')
    a_bytes = (a << 24 | a_color).to_bytes(4, byteorder='big')
    b_bytes = (b << 24 | b_color).to_bytes(4, byteorder='big')

    data = header + a_bytes + b_bytes
    out = data + bytes(64 - len(data))
    return out


# 逐渐点亮按键
def show_chars(device, chars):

    a = 0
    a_color = 0
    b = 0
    b_color = 0
    for i, k in enumerate(chars):
        key = KEYMAP[k]
        a = key
        a_color = 0xff0000
        b = 0
        b_color = 0
        if i > 0:
            b = KEYMAP[chars[i - 1]]
            b_color = 0x00ff00
        device.write_packet(get_key_bytes(a, b, a_color, b_color))
        time.sleep(0.5)

    a_color = 0x00ff00
    b_color = 0x00ff00
    device.write_packet(get_key_bytes(a, b, a_color, b_color))


def split_list(lst, n):
    return [lst[i:i + n] for i in range(0, len(lst), n)]

# 关闭所有灯光
def close_all_light(device):
    key_list = split_list(list(KEYMAP.values()), 15)
    for keys in key_list:
        key_buf = bytes.fromhex('cc8c0200')
        for key in keys:
            key_buf += (key << 24 | 0x0).to_bytes(4, byteorder='big')
        key_buf = key_buf + bytes(64 - len(key_buf))
        device.write_packet(key_buf)


# 关闭彩色波动
def disable_fluctuation(device):
    device.write_packet(bytes.fromhex(
        'cc8c0500010101010101010101010101010101010101010101010101010101010101010101010001000000000100010101010101010101010101010100000001'))
    device.write_packet(bytes.fromhex(
        'cc8c0600000101010101010101010101010101000000000000010101010101010101010101000100000000000101000101010001000101010100010000000000'))
    device.write_packet(bytes.fromhex(
        'cc8c0700000000000000000000000000000101010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'))

# 开启彩色波动
def enable_fluctuation(device):
    device.write_packet(bytes.fromhex(
        'cc800302000001010101000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'))

def show_chars_with_color(device, chars, color):
    a = 0
    a_color = 0
    b = 0
    b_color = 0
    for i, k in enumerate(chars):
        key = KEYMAP[k]
        a = key
        a_color = color
        b = 0
        b_color = 0
        if i > 0:
            b = KEYMAP[chars[i - 1]]
            b_color = color
        device.write_packet(get_key_bytes(a, b, a_color, b_color))

def show_emacs_light(device):
    rest_chars = list(KEYMAP.keys())

    emacs_chars = [
        # E
        {"chars": ['3', '2', '1', '`', 'lshift', 'caps', 'tab', 'a', 's', 'lctrl', 'fn', 'lwin', 'lalt'],
         "color":  0x00ff00},
        # M
        {"chars": ['d', 'e', '4', 'f4', '5', 'f6', '6', 'y', 'h'],
         "color":  0xeec900},
        # A
        {"chars": ['n', 'j', 'i', '9', 'f9', 'o', 'l', '.'],
         "color":  0x00ff00},
        # C
        {"chars": ['f12', 'f11', '0', 'p', ';', '\''],
         "color":  0xeec900},
        # S
        {"chars": ['microphone', 'back', ']', 'enter', 'voice+', 'voice-', 'right', 'down', 'left'],
         "color":  0x00ff00},
    ]
    for emacs_char in emacs_chars:
        show_chars_with_color(device, emacs_char["chars"], emacs_char["color"])
        for char in emacs_char["chars"]:
            if char in rest_chars:
                rest_chars.remove(char)

    show_chars_with_color(device, rest_chars, 0x00ffff)
        
if __name__ == '__main__':
    device = AlienwareUSBDriver()
    device.acquire()
    try:
        close_all_light(device)
        # show_emacs_light(device)
        enable_fluctuation(device)
        # disable_fluctuation(device)
    except Exception:
        pass
    finally:
        pass
        device.release()
```

* `close_all_light` 是将所有的按键设置成黑色
* `show_chars` 逐键显示字符
* `enable_fluctuation` 开启彩色波动
* `disable_fluctuation` 关闭彩色波动
* `show_emacs_light` 用键盘显示一个 Emacs 单词

### 限制
本来写了一段 pynput 代码用于监听系统的按键， 想实现一个功能 “当键入某个字符的时候才亮一个按键”， 最后发现 `usb.util.claim_interface` 函数会独占 USB 设备， 导致设置的时候无法输入字符， 影响写代码，  随之放弃这个想法。

好的是， 上面这段程序只需要设置一次就好了， Dell 的 USB 键盘设备应该自带了一个存储， 即使重启电脑后， 键盘灯的设置都可以保持， 这样就不需要我给键盘灯设置一个系统服务开机启动了。

### 最后
爱一个人， 就给他写破解程序吧。 ;)
