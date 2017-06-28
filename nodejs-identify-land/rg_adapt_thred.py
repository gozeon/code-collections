#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Copyright (c) 2017  hanlixiao<hanlixiao@gagogroup.com>. All rights reserved.

import sys
from PIL import Image
from pylab import *
import numpy as np
import skimage.morphology as sm
from skimage import measure
from collections import Counter
from numpy.matlib import repmat



def Douglas(D, LINSTRING, Result):
    """
    道格拉斯抽稀
    :param D: 抽稀阈值
    :param LINSTRING:矢量
    :param Result:抽稀结果矢量
    :return:
    """
    dmax = 0
    index_L = 0

    if len(LINSTRING) <= 2:
        return
    A = (LINSTRING[0][1] - LINSTRING[-1][1])
    B = (LINSTRING[-1][0] - LINSTRING[0][0])
    C = (LINSTRING[0][0] * LINSTRING[-1][1] - LINSTRING[-1][0] * LINSTRING[0][1])

    for i in range(1, len(LINSTRING) - 1):

        d = abs(A * LINSTRING[i][0] + B * LINSTRING[i][1] + C) / np.sqrt(pow(A, 2) + pow(B, 2))

        if d > dmax:
            index_L = i
            dmax = d

    if dmax > D:
        Result.append(LINSTRING[index_L])

        LINSTRING1 = []
        LINSTRING1 = LINSTRING[0:index_L + 1]
        Douglas(D, LINSTRING1, Result)
        LINSTRING2 = []
        LINSTRING2 = LINSTRING[index_L:]
        Douglas(D, LINSTRING2, Result)
    return Result


def Near_F1(Point, edss_list, Vector):
    """
        矢量化
        :param Point:
        :param edss_list:
        :param Vector:
        :return:
        """
    dis = np.sum(np.abs(repmat(Point, len(edss_list), 1) - edss_list), 1)
    new_dis = np.sort(dis, 0)
    idx = np.where(dis == new_dis[0])[0]

    if (len(new_dis) > 1 and len(idx) > 1 and len(Vector) > 0):
        cos1 = np.sum(np.multiply((edss_list[idx[0]] - Point), (Point - Vector))) / (
            np.sqrt(sum(np.multiply(Point - Vector, Point - Vector))) * np.sqrt(
                sum(np.multiply(edss_list[idx[0]] - Point, edss_list[idx[0]] - Point))))
        cos2 = np.sum(np.multiply((edss_list[idx[1]] - Point), (Point - Vector))) / (
            np.sqrt(sum(np.multiply(Point - Vector, Point - Vector))) * np.sqrt(
                sum(np.multiply(edss_list[idx[1]] - Point, edss_list[idx[1]] - Point))))
        if cos2 > cos1:
            idx[0] = idx[1]
        elif cos2 == cos1:
            N_Point = []
            N_Point = edss_list[idx[0]]
            N_edss_list = []
            N_edss_list = edss_list[:]
            N_edss_list.pop(idx[0])
            N_dis = np.sum(np.multiply(repmat(N_Point, len(N_edss_list), 1) - N_edss_list,
                                       repmat(N_Point, len(N_edss_list), 1) - N_edss_list), 1)
            NN_dis = np.sort(N_dis)
            N_edss_list2 = []
            N_edss_list2 = edss_list[:]
            N_Point2 = []
            N_Point2 = N_edss_list2[idx[1]]
            N_edss_list2.pop(idx[1])
            N_dis2 = np.sum(np.multiply(repmat(N_Point2, len(N_edss_list2), 1) - N_edss_list2,
                                        repmat(N_Point2, len(N_edss_list2), 1) - N_edss_list2), 1)
            NN_dis2 = np.sort(N_dis2)
            if NN_dis[0] > NN_dis2[1]:
                idx[0] = idx[1]

    redis = new_dis[0]
    reidx = idx[0]
    return (redis, reidx)
def region_grown(seed,thred,neighborpoint,img_gray):
    """
    :param seed: 种子点
    :param thred: 阈值
    :param neighborpoint: 八邻域
    :param img_gray: 图像
    :return: 增长区域
    """
    img_flag = np.zeros(img_gray.shape)
    seeds = []
    seeds.append(seed)
    while (seeds == []):
        seeds.append(seed)

    img_flag[seed[0], seed[1]] = 1
    while (len(seeds) != 0):
        seed = seeds.pop()
        for i in range(len(neighborpoint)):
            tmpx = seed[0] + neighborpoint[i][0]
            tmpy = seed[1] + neighborpoint[i][1]
            if (tmpx < 0 or tmpy < 0 or tmpx >= img_gray.shape[0] or tmpy >= img_gray.shape[1]):
                continue
            if ((np.abs(int(img_gray[tmpx, tmpy]) - int(img_gray[seed[0], seed[1]])) < thred) and img_flag[
                tmpx, tmpy] == 0):
                img_flag[tmpx, tmpy] = 1  #
                if [tmpx, tmpy] not in seeds:
                    seeds.append([tmpx, tmpy])

    img_res_remove_holess = sm.remove_small_holes(uint8(img_flag), 1000)
    se2 = sm.square(3)
    img_res_remove_holes1 = sm.closing(img_res_remove_holess, se2)
    return img_res_remove_holes1


def SRG(cx, cy, Path):
    """
       区域增长
       :param Path:输入图像路径
       :param thred:区域增长阈值
       :param model:增长模式
       :return:
       """
    # 区域增长
    if cx < 0:
        cx = 0
    if cx > 255:
        cx = 255
    if cy < 0:
        cy = 0
    if cy > 255:
        cy = 255


    img_gray = array(Image.open(Path).convert('L'))


    # ## 8
    # if (model == 1):
    neighborpoint = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]
    # else:
    #     neighborpoint = [[0, -1], [0, 1], [1, 0], [-1, 0]]

    img_flag = np.zeros(img_gray.shape)
    seed = [int(cy), int(cx)]
    # 根据8邻域判断，避免起始点为散点
    neighbor = []
    nei_thr = []
    for i in range(len(neighborpoint)):
        tmpx = seed[0] + neighborpoint[i][0]
        tmpy = seed[1] + neighborpoint[i][1]
        if (tmpx < 0 or tmpy < 0 or tmpx >= img_gray.shape[0] or tmpy >= img_gray.shape[1]):
            continue
        neighbor.append([tmpx, tmpy])
        nei_thr.append(np.abs(int(img_gray[tmpx, tmpy]) - int(img_gray[seed[0], seed[1]])))
    nei_min = np.min(nei_thr)
    flag = -1
    for j in range(len(neighbor)):
        seed_nei = neighbor[j]
        for i in range(len(neighborpoint)):
            tmpx = seed_nei[0] + neighborpoint[i][0]
            tmpy = seed_nei[1] + neighborpoint[i][1]
            if (tmpx < 0 or tmpy < 0 or tmpx >= img_gray.shape[0] or tmpy >= img_gray.shape[1] or [tmpx, tmpy] == seed):
                continue
            if np.abs(int(img_gray[tmpx, tmpy]) - int(img_gray[seed_nei[0], seed_nei[1]])) < nei_min:
                nei_min = np.abs(int(img_gray[tmpx, tmpy]) - int(img_gray[seed_nei[0], seed_nei[1]]))
                flag = j
    if flag != -1:
        seed = neighbor[j]
    seed_start = seed
    #自适应阈值
    sub = 2 * img_gray[(seed[0] - 1):seed[0] + 2, (seed[1] + 1):seed[1] + 2]
    sub_std = np.std(sub)

    thred = sub_std

    if thred > 4:
        thred = 4
    elif thred < 2:
        thred = 2
    img_res_remove_holes1 = region_grown(seed_start, thred, neighborpoint, img_gray)
    while (np.array(np.where(img_res_remove_holes1 == True)).shape[1] < 300 and thred < 6):
        thred = thred + 1
        img_res_remove_holes1 = region_grown(seed_start, thred, neighborpoint, img_gray)
    # seeds = []
    # seeds.append(seed)
    # img_flag[seed[0], seed[1]] = 1
    # while (len(seeds) != 0):
    #     ##
    #     seed = seeds.pop()
    #     ##
    #     for i in range(len(neighborpoint)):
    #         tmpx = seed[0] + neighborpoint[i][0]
    #         tmpy = seed[1] + neighborpoint[i][1]
    #         if (tmpx < 0 or tmpy < 0 or tmpx >= img_gray.shape[0] or tmpy >= img_gray.shape[1]):
    #             continue
    #         if ((np.abs(int(img_gray[tmpx, tmpy]) - int(img_gray[seed[0], seed[1]])) < thred) and img_flag[
    #             tmpx, tmpy] == 0):
    #             img_flag[tmpx, tmpy] = 1
    #             if [tmpx, tmpy] not in seeds:
    #                 seeds.append([tmpx, tmpy])
    # img_res_remove_holess = sm.remove_small_holes(uint8(img_flag), 1000)
    # se2 = sm.square(3)
    # img_res_remove_holes1 = sm.closing(img_res_remove_holess, se2)
    img_add2 = np.zeros(list(array(img_gray.shape) + 2))
    img_add2[1:-1, 1:-1] = img_res_remove_holes1
    # 边缘提取
    contours = measure.find_contours(img_add2, 0.1)
    con = contours[0].T
    con2 = con.astype(int) - 1
    con2=np.where(con2<0,0,con2)
    con2=np.where(con2>255,255,con2)
    con3 = con2.T

    con_list = []
    con_tuple = []
    for i in range(len(con3)):
        if list(con3[i]) not in con_tuple:
            con_tuple.append(list(con3[i]))
            con_list.append(con3[i])
    s = array(con_list)
    s1 = s.T
    # 矢量化
    edss = s1
    edss_list = list(edss.T)

    Point = edss_list.pop()
    Point1 = []
    Point1.append(Point)
    Vector = []
    while (len(edss_list)):
        [dis, idx] = Near_F1(Point, edss_list, Vector)
        if dis > 10:
            edss_list.pop(idx)
            continue
        else:
            Vector = Point
            Point1.append(edss_list[idx])
            Point = edss_list.pop(idx)
    PPoint = array(Point1)
    # 判断是否为逆向
    Start_Point = PPoint[0]
    End_Point = PPoint[-1]
    Inner_Point = [int(cy), int(cx)]
    Point_cross = np.cross(Inner_Point - Start_Point, Inner_Point - End_Point)
    if Point_cross < 0:
        Point1.reverse()
    Point1.append(Point1[-1])
    PPoint1 = array(Point1)
    sss = PPoint1.T
    ss = np.zeros(sss.shape)
    ss[0] = sss[1]
    ss[1] = sss[0]
    PPoint2 = ss.T
    result = []
    for point in PPoint2:
        result.append(point.tolist())

    # 利用道格拉斯进行抽稀
    Result = []
    D = 2
    LINSTRING = result
    Douglas(D, LINSTRING, Result)
    Result.append(LINSTRING[0])
    Result.append(LINSTRING[-1])
    new_Result = []

    for point in LINSTRING:
        if point in Result:
            new_Result.append(point)
    new_Result.append(new_Result[0])
    print (new_Result)
    return new_Result


def main():
    # SRG(cx, cy, Path)

    SRG(int(cx), int(cy), Path)

if __name__ == "__main__":
    # cx=143
    # cy=213
    # Path = '/home/hlx/Downloads/872603430.jpg'
    cx = sys.argv[1]
    cy = sys.argv[2]
    Path = sys.argv[3]
    main()