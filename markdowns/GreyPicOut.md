# 图像类素描处理

![图片](images/GreyPicOut1.jpg)

> 体验区：加载很慢 https://xia0ya.shinyapps.io/ImageGrayedOut/

![图片展示](images/GreyPicOut.jpg)

```R

library(shiny)
library(sketcher)
library(memoise)

# 定义缓存版本的 sketch 函数
sketch_cached <- memoise(function(im, alpha, beta, shadow) {
  sketch(im, alpha, beta, 0, shadow = shadow)
})

# 定义 UI
ui <- fluidPage(
  titlePanel("Image Sketcher"),
  sidebarLayout(
    sidebarPanel(
      fileInput("file1", "Choose an Image File",
                multiple = FALSE,
                accept = c("image/png", "image/jpeg", "image/gif")),
      sliderInput("alpha", "Alpha:", min = 0, max = 2, value = 1, step = 0.1),
      sliderInput("beta", "Beta:", min = 0, max = 2, value = 1, step = 0.1),
      sliderInput("shadow", "Shadow:", min = 0, max = 2, value = 1, step = 0.1)
    ),
    mainPanel(
      tabsetPanel(
        tabPanel("Original Image", plotOutput("originalPlot")),
        tabPanel("Sketch Image", plotOutput("sketchPlot"))
      )
    )
  )
)

# 定义服务器逻辑
server <- function(input, output, session) {
  # 反应式表达式，处理用户上传的图片
  image_data <- reactive({
    req(input$file1)
    im <- im_load(input$file1$datapath)
    sketch_params <- list(
      alpha = input$alpha,
      beta = input$beta,
      shadow = input$shadow
    )
    list(original = im, sketch = sketch_cached(im, sketch_params$alpha, sketch_params$beta, sketch_params$shadow))
  })
  
  # 显示原图
  output$originalPlot <- renderPlot({
    im <- image_data()$original
    plot(im)
  })
  
  # 显示素描图
  output$sketchPlot <- renderPlot({
    im2 <- image_data()$sketch
    plot(im2)
  })
}

# 创建 Shiny 应用
shinyApp(ui = ui, server = server)
```