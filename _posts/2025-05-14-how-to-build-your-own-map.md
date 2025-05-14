---
layout: post
title: 一天自制自己的地图软件
categories: [Tech]
---

![]({{site.url}}/pics/your-own-map/1.jpeg)

一天自制地图规划的核心技术小黑板：

1. 地址转换坐标： 输入中文地址，通过高德 API， 返回模糊搜索列表，选中地址后返回经纬度， 用 OpenStreetMap API 也可以， 但是搜索不出来中国小众地名，比如 xx 超市

2. 自动路径规划： 用 Python TSP 这个库的 solve_tsp_dynamic_programming 函数，丢一堆地址的经纬度列表给它，TSP 函数可以实现地图路径的动态规划排序

3. 绘制地图： 最后用 project-osrm API 请求， 根据第二步的已经排序好的坐标列表， 绘制地图的导航路径， 比如汽车就绘制高速，自行车和走路也可以, API 请求参考形式 http://router.project-osrm.org/route/v1/car/${latlngsArg}?overview=full

源码参考： 
