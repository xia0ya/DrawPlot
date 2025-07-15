# R语言可视化海报绘图

![图片展示](images/Visualization_poster1.jpg)

![图片展示2](images/Visualization_poster.png)

> 注意，需要Rmd文件使用，具体参考如参考链接,打开大屏可视化可以适当缩小页面

## 大屏可视化

``````R
---
title: <br>浙江财经大学数据科学学院<br>2022级学生可视化分析
author:
  - name: 刘晓亮
column_numbers: 3

output: 
  posterdown::posterdown_html:
    self_contained: true
    css: style.css
primary_colour: "#035AA6"
accent_colour: "#035AA6"
sectitle2_textcol: "#035AA6"

---

<style>
.title, .author {
  text-align: center; /* 让标题和作者信息居中 */
}
</style>


```{r setup, include=FALSE}
knitr::opts_chunk$set(echo = FALSE)
```

```{r}
# 加载包，读取数据
# 设置警告为错误，静默加载包
options(warn = 2) 

# 静默加载所需的包
suppressWarnings(suppressMessages(library(ggplot2)))
suppressWarnings(suppressMessages(library(readxl)))
suppressWarnings(suppressMessages(library(sf)))
suppressWarnings(suppressMessages(library(ggrepel)))
suppressWarnings(suppressMessages(library(tidyverse)))
suppressWarnings(suppressMessages(library(geojsonsf)))
suppressWarnings(suppressMessages(library(dplyr)))
suppressWarnings(suppressMessages(library(colorblindcheck)))  # 使用调色板



```

```{r}
# 加载我们分析所用数据
name <- read_excel("2022级学生数据-姓名.xlsx")
data <- read_excel("2022级学生数据-脱敏.xlsx")
```



# 百家姓分布

浙江财经大学数据科学学院2022级学生百家姓分析如下：可见，张王李陈是妥妥的大姓。


```{r echo = FALSE, out.width='100%', fig.retina=3, fig.align='center'}
# 绘制姓名词云图
library(wordcloud2)
# 提取姓名列的第一个字符
name1 <- name %>%
  mutate(姓 = substr(姓名, 1, 1)) %>%
  select(姓)
# 计算每个字符出现的频率
word_freq <- table(name1$姓)
# 将频次表转换为数据框
wordmap <- as.data.frame(word_freq, stringsAsFactors = FALSE)
names(wordmap) <- c("word", "freq")  # 确保列名正确
# 绘制词云图
wordcloud2(wordmap, size = 1, shape = 'pentagon')

```


# 生源地地理分布
我们看到浙江本土的人数最多的，足足有200多个，其他地方最高也没有超过20人，内蒙则直接没有。

```{r echo = FALSE, out.width='100%', fig.retina=3, fig.align='center'}
# 计算每个省份的人数
options(warn = -1)  # 关闭所有警告

province_counts <- data %>%
  group_by(生源地) %>%
  summarise(人数 = n(), .groups = "drop")
# 读取地图数据并重命名
china_map <- geojson_sf("100000.geo.json")

# 合并高校新生人数数据到地图
china_students <- china_map %>% left_join(province_counts, by = c("name" = "生源地"))

# 将 NA 值填充为 0
china_students <- china_students %>%
  mutate(人数 = ifelse(is.na(人数), 0,人数))

# 定义颜色映射函数
get_color <- function(count) {
  if (count == 0) {
    return("#ffc7c7")  # 无人数时显示灰色
  } else if (count <= 5) {
    return("#cca8e9")
  } else if (count <= 10) {
    return("#ffde7d")
  } else if (count <= 15) {
    return("#f6f7d7")
  } else if (count <= 20) {
    return("orange")
  } else {
    return("red")
  }
}

# 添加颜色列到数据框
china_students <- china_students %>%
  mutate(color = sapply(人数, get_color))

# 绘制高校新生人数的地理图
ggplot() +
  geom_sf(data = china_map, fill = "grey95", color = "white") +
  
  # 绘制各省份的图层
  geom_sf(data = china_students, 
          aes(fill = color), 
          color = "black", size = 0.4) +
  
  # 添加省份人数标签
  geom_sf_text(data = china_students, 
               aes(label = 人数), 
               size = 3, 
               color = "black") +  # 可调整字体大小和颜色
  
  # 手动设置颜色
  scale_fill_identity(name = "人数") +  # 使用颜色列
  labs(title = "地理分布图") +
  theme_void() +
  theme(plot.title = element_text(hjust = 0.5, size = 24, face = "bold")) +
  guides(fill = guide_legend(title.position = "top"))
```

# 性别分布扇形图

```{r echo = FALSE, out.width='100%', fig.retina=3, fig.align='center'}

# 绘制表格
xinbie_counts <- data %>%
  group_by(性别) %>%
  summarise(人数 = n(), .groups = "drop")
knitr::kable(xinbie_counts[1:2, 1:2], 
              align = 'c', 
              format = "html")

```
就本次数据来看，我校数科还是男生多于女生的。

```{r echo = FALSE, out.width='100%', fig.retina=3, fig.align='center'}
xinbie_counts <- data %>%
  group_by(性别) %>%
  summarise(人数 = n(), .groups = "drop")
 

pie(xinbie_counts$人数, labels = paste(xinbie_counts$性别,xinbie_counts$人数), 
    radius = 1.0, clockwise = TRUE, 
    main = "性别分布扇形图")

```



# 出生日期
2003年，2004年出生的学生占了大多数。而年龄最小于最大之间隔了6年。


```{r echo = FALSE, out.width='100%', fig.retina=3, fig.align='center'}
chusheng_counts <- data %>%
  mutate(出生年份 = substr(出生日期, 1, 4)) %>%  # 提取出生年份
  group_by(出生年份) %>%                           # 按出生年份分组
  summarise(人数 = n(), .groups = "drop")         # 计算每个年份的人数

# 定义每个出生年份的颜色
colors <- c("2000" = "lightblue", "2001" = "lightgreen", "2002" = "lightcoral", 
            "2003" = "lightsalmon", "2004" = "lightgoldenrod", "2005" = "lightpink")

# 绘制出生年份人数统计条形图
ggplot(chusheng_counts, aes(x = 出生年份, y = 人数, fill = 出生年份)) +
  geom_bar(stat = "identity", color = "black") +  # 绘制条形图
  geom_text(aes(label = 人数), vjust = -0.5, size = 4) +  # 添加数值标签
  labs(title = "出生年份人数统计图", x = "出生年份", y = "人数") +  # 添加标签
  scale_fill_manual(values = colors) +  # 设置每个年份的颜色
  theme_minimal() + # 使用简约主题
  theme(panel.grid.major = element_blank(), panel.grid.minor = element_blank())
```

```{r echo = FALSE, out.width='100%', fig.retina=3, fig.align='center'}

# 绘制表格
knitr::kable(chusheng_counts[1:6, 1:2], 
              align = 'c', 
              format = "html")

```

# 各专业人数
金融数学少的可怜啊，才23个人，应用统计就很多了。

```{r echo = FALSE, out.width='100%', fig.retina=3, fig.align='center'}
zhuanye_counts <- data %>%
  group_by(专业名称) %>%
  summarise(人数 = n(), .groups = "drop")

# 定义每个出生年份的颜色
colors <- c("应用统计学" = "lightblue", "金融数学" = "lightcoral", 
            "经济统计学" = "lightsalmon", "数据科学与大数据技术" = "lightgoldenrod")

# 绘制出生年份人数统计条形图
ggplot(zhuanye_counts, aes(x = 专业名称, y = 人数, fill = 专业名称)) +
  geom_bar(stat = "identity", color = "black") +  # 绘制条形图
  geom_text(aes(label = 人数), vjust = -0.5, size = 4) +  # 添加数值标签
  labs(title = "各专业人数统计图", x = "专业名称", y = "人数") +  # 添加标签
  scale_fill_manual(values = colors)+  # 设置每个年份的颜色
  theme_minimal() +
  theme(panel.grid.major = element_blank(), panel.grid.minor = element_blank())
```

# 各民族人数统计

```{r echo = FALSE, out.width='100%', fig.retina=3, fig.align='center'}
# 计算各民族人数统计，并排除汉族
mingzu_counts <- data %>%
  filter(民族 != "汉族") %>%  # 过滤掉汉族
  group_by(民族) %>%
  summarise(人数 = n(), .groups = "drop")

# 绘制饼图，并在图上显示数据
pie(mingzu_counts$人数, labels = paste(mingzu_counts$民族, mingzu_counts$人数), 
    radius = 1.0, clockwise = TRUE, 
    main = "少数民族分布扇形图")

```



# 参考
https://textdata.cn/blog/2022-09-04-posterdown/
https://cran.r-project.org/web/packages/posterdown/posterdown.pdf
https://www.shilaan.com/post/academic-conference-posters-using-posterdown/
https://github.com/shilaan/Many-Analysts

``````

## 组图

```R
# 地理图
# 设置警告为错误，静默加载包
options(warn = 2) 

# 静默加载所需的包
suppressWarnings(suppressMessages(library(ggplot2)))
suppressWarnings(suppressMessages(library(readxl)))
suppressWarnings(suppressMessages(library(sf)))
suppressWarnings(suppressMessages(library(ggrepel)))
suppressWarnings(suppressMessages(library(tidyverse)))
suppressWarnings(suppressMessages(library(geojsonsf)))
suppressWarnings(suppressMessages(library(dplyr)))
suppressWarnings(suppressMessages(library(colorblindcheck)))  # 使用调色板
library(patchwork)

name <- read_excel("2022级学生数据-姓名.xlsx")
data <- read_excel("2022级学生数据-脱敏.xlsx")


# 计算每个省份的人数
options(warn = -1)  # 关闭所有警告

province_counts <- data %>%
  group_by(生源地) %>%
  summarise(人数 = n(), .groups = "drop")
# 读取地图数据并重命名
china_map <- geojson_sf("100000.geo.json")

# 合并高校新生人数数据到地图
china_students <- china_map %>% left_join(province_counts, by = c("name" = "生源地"))

# 将 NA 值填充为 0
china_students <- china_students %>%
  mutate(人数 = ifelse(is.na(人数), 0,人数))

library(ggplot2)
library(dplyr)
library(patchwork)
# 设置全局主题，修正背景为白色
theme_set(theme_minimal(base_size = 14) +
            theme(
              panel.background = element_rect(fill = "white", color = NA),
              plot.background = element_rect(fill = "white", color = NA),
              panel.grid = element_blank()
            ))
# 地理分布图
# 计算每个省份的人数
options(warn = -1)  # 关闭所有警告

province_counts <- data %>%
  group_by(生源地) %>%
  summarise(人数 = n(), .groups = "drop")
# 读取地图数据并重命名
china_map <- geojson_sf("100000.geo.json")

# 合并高校新生人数数据到地图
china_students <- china_map %>% left_join(province_counts, by = c("name" = "生源地"))

# 将 NA 值填充为 0
china_students <- china_students %>%
  mutate(人数 = ifelse(is.na(人数), 0,人数))

# 定义颜色映射函数
get_color <- function(count) {
  if (count == 0) {
    return("#ffc7c7")  # 无人数时显示灰色
  } else if (count <= 5) {
    return("#cca8e9")
  } else if (count <= 10) {
    return("#ffde7d")
  } else if (count <= 15) {
    return("#f6f7d7")
  } else if (count <= 20) {
    return("orange")
  } else {
    return("red")
  }
}

# 添加颜色列到数据框
china_students <- china_students %>%
  mutate(color = sapply(人数, get_color))

# 绘制高校新生人数的地理图
p1 <-ggplot() +
  geom_sf(data = china_map, fill = "grey95", color = "white") +
  
  # 绘制各省份的图层
  geom_sf(data = china_students, 
          aes(fill = color), 
          color = "black", size = 0.4) +
  # # 添加省份名称
  # geom_sf_text(data = china_students, 
  #              aes(label =paste0(name,"\n")), 
  #              size = 3, 
  #              color = "black") +  # 可调整字体大小和颜色
  
  # 添加省份人数标签
  geom_sf_text(data = china_students, 
               aes(label = 人数), 
               size = 3, 
               color = "black") +  # 可调整字体大小和颜色

  
  # 手动设置颜色
  scale_fill_identity(name = "人数") +  # 使用颜色列
  labs(title = "地理分布图") +
  theme_void() +
  theme(plot.title = element_text(hjust = 0.5, size = 24, face = "bold")) +
  guides(fill = guide_legend(title.position = "top"))
# 性别分布图
xinbie_counts <- data %>%
  group_by(性别) %>%
  summarise(人数 = n(), .groups = "drop")

p2 <- ggplot(xinbie_counts, aes(x = "", y = 人数, fill = 性别)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar(theta = "y") +
  geom_text(aes(label = paste0(性别, "\n", 人数)), position = position_stack(vjust = 0.5), color = "black") +
  labs(title = "性别分布扇形图") +
  theme_void() +
  theme(plot.title = element_text(hjust = 0.5, size = 14))

# 出生年份统计图
chusheng_counts <- data %>%
  mutate(出生年份 = substr(出生日期, 1, 4)) %>%
  group_by(出生年份) %>%
  summarise(人数 = n(), .groups = "drop")

p3 <- ggplot(chusheng_counts, aes(x = 出生年份, y = 人数, fill = 出生年份)) +
  geom_bar(stat = "identity", color = "black") +
  geom_text(aes(label = 人数), vjust = -0.5, size = 4) +
  labs(title = "出生年份人数统计图", x = "出生年份", y = "人数") +
  scale_fill_brewer(palette = "Pastel1") +
  theme_minimal() +
  ylim(0,300)+
  theme(panel.grid.major = element_blank(), panel.grid.minor = element_blank())

# 专业人数统计图
zhuanye_counts <- data %>%
  group_by(专业名称) %>%
  summarise(人数 = n(), .groups = "drop")

p4 <- ggplot(zhuanye_counts, aes(x = 专业名称, y = 人数, fill = 专业名称)) +
  geom_bar(stat = "identity", color = "black") +
  geom_text(aes(label = 人数), vjust = -0.5, size = 4) +
  labs(title = "各专业人数统计图", x = "专业名称", y = "人数") +
  scale_fill_brewer(palette = "Pastel2") +
  theme_minimal() +
  ylim(0,200)+
  theme(panel.grid.major = element_blank(), panel.grid.minor = element_blank())

# 少数民族分布图
mingzu_counts <- data %>%
  filter(民族 != "汉族") %>%
  group_by(民族) %>%
  summarise(人数 = n(), .groups = "drop")

p5 <- ggplot(mingzu_counts, aes(x = "", y = 人数, fill = 民族)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar(theta = "y") +
  geom_text(aes(label = paste0(民族, "\n", 人数)), position = position_stack(vjust = 0.5), color = "black") +
  labs(title = "少数民族分布扇形图") +
  theme_void() +
  theme(plot.title = element_text(hjust = 0.5, size = 14))

# 使用 patchwork 将图表整合到一张图中
final_plot <- (p3 / p4) | (p1/p2) 
 # plot_annotation(title = "2022级学生数据分析图表", 
                  #theme = theme(plot.title = element_text(hjust = 0.5, size = 20, face = "bold")))

print(final_plot)

```