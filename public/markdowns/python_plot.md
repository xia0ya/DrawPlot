> 使用可视化布局，支持拖拽调整
> page = Page(layout=Page.DraggablePageLayout)
> 这是最关键的 Page.save_resize_html("Awesome-pyecharts.html", cfg_file="./chart_config.json", dest="my_new_charts.html")

ttps://github.com/pyecharts/website/blob/master/zh-cn/composite_charts.md

DraggablePageLayout 布局

```python
page = Page(layout=Page.DraggablePageLayout)
page.add(bar_datazoom_slider(), line_markpoint(), pie_rosetype(), grid_mutil_yaxis())
page.render()
```

```python
# DraggablePageLayout 利用 Jquery 以及 Echarts 本身的 resize 功能，实现了可拖拽布局。使用步骤如下
# 1.指定 Page 布局
page = Page(layout=Page.DraggablePageLayout)

# 正常 render 图表
page.add(bar_datazoom_slider(), line_markpoint(), pie_rosetype(), grid_mutil_yaxis())
page.render()

# 使用浏览器打开渲染后的 .html 文件，默认为 render.html。拖拉/调整图表位置和大小，当调整到一个适合
# 的布局时，点击左上方的 `Save Config` 按钮，下载 chart_config.json 配置文件，假设存放位置为
# ~/chart_config.json。再次渲染图表并指定其布局配置

# Warning: 请注释掉上面的的所有渲染代码，就是以下三行。因为 html 已经生成，并不需要再重新渲染一遍。
# page = Page(layout=Page.DraggablePageLayout)
# page.add(bar_datazoom_slider(), line_markpoint(), pie_rosetype(), grid_mutil_yaxis())
# page.render()

# render.html：第一步生成的原 html 文件
# chart_config.json：第二步下载的配置文件
# my_new_charts.html：新 html 文件路径
Page.save_resize_html("render.html", cfg_file="~/chart_config.json", dest="my_new_charts.html")

# 或者可以使用 json 数据
# cfg_dict 为 json 文件里面的内容
Page.save_resize_html("render.html", cfg_dict=cfg_dict, dest="my_new_charts.html")

# Question：能否复用渲染模板？
# Answer: 可以的，渲染配置 json 数据中是以 chart_id 来作为一个图形的唯一标识符的，所以只需要在
# 第一次渲染的时候指定 chart_id 就可以啦。
# example:
# bar = bar_datazoom_slider()
# bar.chart_id = "chenjiandongx_is_an_awesome_boy"
# line = line_markpoint()
# line.chart_id = "chenjiandongx_is_an_amazing_boy"
# pie = pie_rosetype()
# pie.chart_id = "chenjiandongx_is_an_adorable_boy"
# 然后只要以后都按这个 chart_id 来渲染图表的时候，你的布局配置就可以复用啦。
# cat chart_config.json，会发现 chart_id 是固定的啦。
page.add(bar_datazoom_slider(), line_markpoint(), pie_rosetype()))
```

```python
# %% [markdown]
# # 1、全国哪些城市对大模型岗位需求比较高，基于招聘数据，可视化招聘岗位数量全国各城市地域分布图（以市级为行政单元，不要用省份）

# %%
import pandas as pd
import numpy as np
from pyecharts import options as opts
from pyecharts.charts import Map, Bar, Pie, WordCloud, Page
from pyecharts.globals import ThemeType
import re
# %pip install pyecharts
%matplotlib inline



# %%
# 替换为你实际的 CSV 路径
file_path = "大模型岗位信息.csv"
df = pd.read_csv(file_path)

# 处理薪资数据
def extract_salary(salary_str):
    if pd.isna(salary_str):
        return np.nan
    numbers_str = re.findall(r'\d+', salary_str)
    min_salary = max_salary = np.nan
    months_per_year = 12
    if len(numbers_str) >= 2:
        try:
            min_salary_k = int(numbers_str[0])
            max_salary_k = int(numbers_str[1])
            min_salary = min_salary_k * 1000
            max_salary = max_salary_k * 1000
            if len(numbers_str) >= 3:
                try:
                    months_per_year = int(numbers_str[2])
                except:
                    pass
            avg_monthly_salary = ((min_salary + max_salary) / 2) * months_per_year / 12
            return avg_monthly_salary
        except:
            return np.nan
    return np.nan

def extract_city(location):
    if pd.isna(location):
        return np.nan
    city = location.split('-')[0].strip().replace(' ', '')
    return city

def process_tags(tags):
    if pd.isna(tags):
        return []
    return [tag.strip() for tag in tags.split(',')]
# 应用处理函数
df['平均月薪'] = df['岗位薪资'].apply(extract_salary)
df['城市'] = df['工作地点'].apply(extract_city)
df['岗位标签列表'] = df['岗位标签'].apply(process_tags)



# %%
df.head()

# %% [markdown]
# ## 城市岗位地图

# %%
from pyecharts.commons.utils import JsCode
# 去除“市”字，仅保留城市名
df['城市_clean'] = df['城市'].str.replace("市", "").str.replace("区", "").str.replace("县", "").str.strip()

from pyecharts import options as opts
from pyecharts.charts import Map

# 统计岗位数量
city_counts = df['城市_clean'].value_counts().to_dict()
city_counts = {k + "市" if not k.endswith("市") else k: v for k, v in city_counts.items()}
# 构造地图
map_city_job = (
    Map()
    .add(
        "岗位数量",
        [list(z) for z in city_counts.items()],
        maptype="china-cities",  # 关键：启用市级地图
        label_opts=opts.LabelOpts(
    is_show=True,
    formatter=JsCode("""
        function(params){
            if (params.value > 0) {
                return params.name;
            } else {
                return '';
            }
        }
    """)
)
    )
    .set_global_opts(
        title_opts=opts.TitleOpts(title="全国大模型岗位需求城市分布（市级）"),
        visualmap_opts=opts.VisualMapOpts(
            is_piecewise=True,
            pieces=[
                {"min": 100, "label": "100以上", "color": "#FF0000"},
                {"min": 50, "max": 99, "label": "50-99", "color": "#FFA07A"},
                {"min": 20, "max": 49, "label": "20-49", "color": "#FFD700"},
                {"min": 10, "max": 19, "label": "10-19", "color": "#98FB98"},
                {"min": 1, "max": 9, "label": "1-9", "color": "#87CEFA"},
                {"value": 0, "label": "无数据", "color": "#EEEEEE"}
            ]
        )
    )
)

# Jupyter 内嵌显示
map_city_job.render_notebook()



# %%
city_counts = {k + "市" if not k.endswith("市") else k: v for k, v in city_counts.items()}
city_counts

# %%


# %% [markdown]
# # 2、（可选）全国哪些城市薪资待遇比较好，基于招聘薪资待遇情况，转换为平均月薪，可视化平均薪资待遇全国各城市地域分布图（以市级为行政单元，不要用省份）

# %%
city_salary = df.dropna(subset=['平均月薪']).groupby('城市')['平均月薪'].mean().round(2).to_dict()
city_salary = city_counts = {k + "市" if not k.endswith("市") else k: v for k, v in city_salary.items()}
max_salary_val = max(city_salary.values()) if city_salary else 150000

map_salary = (
    Map()
    .add("平均月薪", [list(z) for z in city_salary.items()],maptype="china-cities",
        label_opts=opts.LabelOpts(
    is_show=True,
    formatter=JsCode("""
        function(params){
            if (params.value > 0) {
                return params.name;
            } else {
                return '';
            }
        }
    """)
))
    .set_global_opts(
        title_opts=opts.TitleOpts(title="全国大模型岗位平均薪资分布"),
        visualmap_opts=opts.VisualMapOpts(
            min_=0,
            max_=max_salary_val,
            is_piecewise=True,
            pieces=[
                {"min": 100000, "label": "100k以上", "color": "#8A0808"},
                {"min": 80000, "max": 99999, "label": "80k-99.9k", "color": "#CD0A0A"},
                {"min": 60000, "max": 79999, "label": "60k-79.9k", "color": "#FF0000"},
                {"min": 40000, "max": 59999, "label": "40k-59.9k", "color": "#FFA07A"},
                {"min": 30000, "max": 39999, "label": "30k-39.9k", "color": "#FFD700"},
                {"min": 20000, "max": 29999, "label": "20k-29.9k", "color": "#98FB98"},
                {"min": 10000, "max": 19999, "label": "10k-19.9k", "color": "#87CEFA"},
                {"min": 0, "max": 9999, "label": "0-9.9k", "color": "#ADD8E6"},
            ]
        )
    )
)
map_salary.render_notebook()


# %%
city_salary = df.dropna(subset=['平均月薪']).groupby('城市')['平均月薪'].mean().round(2).to_dict()
city_salary = city_counts = {k + "市" if not k.endswith("市") else k: v for k, v in city_salary.items()}
city_salary

# %%
df.dropna(subset=['平均月薪']).groupby('城市')['平均月薪'].mean().round(2).to_dict()

# %%


# %%
from pyecharts import options as opts
from pyecharts.charts import Bar, Line
from pyecharts.globals import ThemeType


# 统一城市顺序：按岗位数排序
common_cities = sorted(city_counts.items(), key=lambda x: x[1], reverse=True)
cities = [c[0] for c in common_cities]
counts = [city_counts[c] for c in cities]
salaries = [city_salary.get(c, 0) for c in cities]  # 如果城市没薪资数据则补0

# 创建图表对象
bar = (
    Bar(init_opts=opts.InitOpts(theme=ThemeType.LIGHT, width="1000px"))
    .add_xaxis(cities)
    .add_yaxis("岗位数量", counts, yaxis_index=0)
    .extend_axis(
        yaxis=opts.AxisOpts(
            name="平均薪资（元）",
            type_="value",
            min_=0,
            position="right",
            axislabel_opts=opts.LabelOpts(formatter="{value}"),
        )
    )
    .set_global_opts(
        title_opts=opts.TitleOpts(title="城市岗位数量与平均薪资对比"),
        yaxis_opts=opts.AxisOpts(
            name="岗位数量",
            position="left",
            axislabel_opts=opts.LabelOpts(formatter="{value}")
        ),
        xaxis_opts=opts.AxisOpts(axislabel_opts=opts.LabelOpts(rotate=45)),
        tooltip_opts=opts.TooltipOpts(trigger="axis", axis_pointer_type="cross"),
        datazoom_opts=[opts.DataZoomOpts(), opts.DataZoomOpts(type_="inside")]
    )
)

# 添加折线图到次坐标轴（右侧）
line = (
    Line()
    .add_xaxis(cities)
    .add_yaxis("平均薪资", salaries, yaxis_index=1)
)

# 叠加图表
bar.overlap(line).render_notebook()


# %%
df

# %% [markdown]
# # 3、统计所有企业招聘岗位需求数量，并可视化展示招聘岗位数量排名Top20的企业
# 注意：岗位数量Top20的企业柱状图，需要添加区域缩放（全局配置项DataZoomOpts），支持拖拽轴的滑动查看企业排名情况

# %%
company_counts = df['企业名称'].value_counts().head(20)
bar_company = (
    Bar(init_opts=opts.InitOpts(theme=ThemeType.LIGHT))
    .add_xaxis(company_counts.index.tolist())
    .add_yaxis("岗位数量", company_counts.values.tolist())
    .set_global_opts(
        title_opts=opts.TitleOpts(title="Top20企业招聘岗位数量"),
        xaxis_opts=opts.AxisOpts(axislabel_opts=opts.LabelOpts(rotate=45)),
        datazoom_opts=[opts.DataZoomOpts(), opts.DataZoomOpts(type_="inside")],
        yaxis_opts=opts.AxisOpts(name="岗位数量")
    )
)
bar_company.render_notebook()


# %%


# %%


# %% [markdown]
# # 4、基于招聘岗位的学历要求，分析学历类别需求占比情况

# %%
education_counts = df['学历要求'].value_counts()
pie_edu = (
    Pie(init_opts=opts.InitOpts(theme=ThemeType.LIGHT))
    .add("", [list(z) for z in education_counts.items()], radius=["40%", "75%"])
    .set_global_opts(
        title_opts=opts.TitleOpts(title="学历要求分布"),
        legend_opts=opts.LegendOpts(orient="vertical", pos_top="15%", pos_left="2%")
    )
    .set_series_opts(label_opts=opts.LabelOpts(formatter="{b}: {c} ({d}%)"))
)
pie_edu.render_notebook()


# %%


# %%


# %% [markdown]
# # 5、岗位技能需求分析，基于表格给出的岗位标签信息，使用词云图统计分析

# %%
all_tags = []
for tags in df['岗位标签列表']:
    all_tags.extend(tags)
tag_counts = pd.Series(all_tags).value_counts()

wordcloud = (
    WordCloud(init_opts=opts.InitOpts(theme=ThemeType.LIGHT))
    .add("", [list(z) for z in tag_counts.items()], word_size_range=[15, 80], shape="circle")
    .set_global_opts(title_opts=opts.TitleOpts(title="岗位技能需求词云"))
)
wordcloud.render_notebook()


# %%


# %%


# %% [markdown]
# # 组图

# %%


# %%
# page = Page(layout=Page.SimplePageLayout)
# page.add(bar,map_city_job, map_salary, bar_company, pie_edu, wordcloud)
# page.render("大模型岗位分析大屏_page.html")


# %%
# from pyecharts.charts import Page
# from pyecharts.options import TitleOpts

# # 使用可视化布局，支持拖拽调整
# page = Page(layout=Page.DraggablePageLayout)

# # 添加图表
# page.add(
#     map_city_job,   # 地图：岗位数量
#     map_salary,     # 地图：薪资
#     bar,            # 柱状图：城市岗位数
#     bar_company,    # 柱状图：公司数
#     pie_edu,        # 饼图：学历
#     wordcloud,       # 词云：岗位关键词
    
# )

# # 渲染页面，自动生成布局页面，支持拖拽调整位置和大小
# page.render("大模型岗位分析大屏.html")


# %%
# Page.save_resize_html("Awesome-pyecharts.html", cfg_file="./chart_config.json", dest="my_new_charts.html")

# %%

```