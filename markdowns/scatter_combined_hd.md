# 高阶散点图

![图片](images/scatter_combined_hd.png)

![图片](images/scatter_combined_hd1.png)
> 第二张图是原图，很好看的。

```R
library(tidyverse)
library(ggpubr)
library(ggpmisc)
library(patchwork)
library(ggplot2)
library(rlang)

# 构造模拟数据
set.seed(123)
regions <- c("East Asia", "Western Europe", "South Asia", "Sub-Saharan Africa",
             "North America", "Latin America", "Oceania", "Eastern Europe")

generate_mock_data <- function(n = 100, year = 1990) {
  tibble(
    region = sample(regions, n, replace = TRUE),
    ASDR = runif(n, 5, 40),
    ASIR = runif(n, 10, 60),
    DALY_rate = runif(n, 100, 1000),
    SDI = runif(n, 0.2, 0.9),
    EAPC = rnorm(n, 0, 2),
    size = runif(n, 10, 100),
    year = year
  )
}

df_1990 <- generate_mock_data(100, 1990)
df_2019 <- generate_mock_data(100, 2019)
df_all <- bind_rows(df_1990, df_2019)



# 手动设置颜色映射表
region_colors <- c(
  "East Asia" = "#1B9E77",
  "Western Europe" = "#D95F02",
  "South Asia" = "#7570B3",
  "Sub-Saharan Africa" = "#E7298A",
  "North America" = "#66A61E",
  "Latin America" = "#E6AB02",
  "Oceania" = "#A6761D",
  "Eastern Europe" = "#666666"
)

# 优化后的绘图函数
plot_scatter <- function(data, xvar, yvar = "EAPC", sizevar = "size", title = "", ylim_range = NULL) {
  x_sym <- sym(xvar)
  y_sym <- sym(yvar)
  size_sym <- sym(sizevar)
  
  p <- ggplot(data, aes(x = !!x_sym, y = !!y_sym)) +
    geom_point(aes(color = region, size = !!size_sym), alpha = 0.7, stroke = 0.2) +
    geom_smooth(method = "loess", se = FALSE, color = "#0072B5", linewidth = 2) +
    stat_poly_eq(
      aes(label = paste(..adj.rr.label.., ..p.value.label.., sep = "*\", \"*")),
      formula = y ~ x, parse = TRUE, #label.x = max(data[[xvar]], na.rm = TRUE) * 0.2,  # 放在 x 轴 90% 位置
      #label.y = 7 ,   
      label.x.npc = "right",
      label.y.npc = "top"   ,                                # 放在 y 轴可见区,
      size = 4, color = "black"
    ) +
    scale_color_manual(values = region_colors) +
    scale_size_continuous(range = c(2.5, 10)) +
    labs(title = title, x = xvar, y = yvar, color = "Region", size = "Size") +
    theme_minimal(base_size = 18) +
    theme_bw(base_size = 18) +
    theme(
      panel.grid.major = element_blank(),   # 去掉主网格
      panel.grid.minor = element_blank(),   # 去掉次网格
      panel.border = element_blank(),  # 去掉整张图的灰色外框
      plot.background = element_blank(),  # 去掉最外层的白色边框
      axis.line = element_line(color = "black",linewidth = 1.5),  # 添加轴线
      legend.position = "bottom",
      legend.title = element_text(size = 16, face = "bold"),
      legend.text = element_text(size = 15),
      legend.key = element_rect(fill = "white", colour = "grey80"),
      legend.background = element_rect(fill = "white", colour = NA),
      plot.title = element_text(size = 22, face = "bold", hjust = -0.1),
      axis.title = element_text(size = 15),
      axis.text = element_text(size = 15)
      
    ) +
    guides(
      color = guide_legend(title = "", override.aes = list(size = 7, alpha = 1)),
      size  = guide_legend(title = "Size")
    ) +
    annotate("text", x = Inf, y = Inf, label = unique(data$year),
             hjust = 1.1, vjust = 1.2, size = 18, color = "grey90", fontface = "bold")
  if (!is.null(ylim_range)) {
    p <- p + coord_cartesian(ylim = ylim_range)
  }
  return(p)
}




# 图 A-F 数据与变量
plots <- list(
  plot_scatter(df_1990, "ASDR", title = "A",ylim_range = c(-8, 8)),
  plot_scatter(df_2019, "SDI",  title = "B",ylim_range = c(-8, 8)),
  plot_scatter(df_1990, "ASIR", title = "C",ylim_range = c(-8, 8)),
  plot_scatter(df_2019, "SDI",  title = "D",ylim_range = c(-8, 8)),
  plot_scatter(df_1990, "DALY_rate", title = "E",ylim_range = c(-8, 8)),
  plot_scatter(df_2019, "SDI",      title = "F",ylim_range = c(-8, 8))
)



# patchwork 拼图 + 控制每行高度
final_plot <- (plots[[1]] + plots[[2]]) / 
  (plots[[3]] + plots[[4]]) / 
  (plots[[5]] + plots[[6]]) +
  plot_layout(guides = "collect", heights = c(1.2, 1.2, 1.2)) &
  theme(legend.position = "bottom")

print(final_plot)

# 1427*1200
# print(plot_scatter(df_1990, "ASDR", title = "A",ylim_range = c(-10, 10)))
# 导出
ggsave(
  filename = "scatter_combined_hd.png",
  plot     = final_plot,
  width    = 20,   # 横向两列保持 12 英寸
  height   = 14,   # 纵向三行放大到 28 英寸
  units    = "in", # 明确单位
  dpi      = 300,
  bg       = "white"
)

```