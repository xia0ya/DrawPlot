---
title:  多元统计笔记及习题
categories: 数理统计
mathjax: true
tags:
  - 多元统计

typora-root-url: ..\..\public

---

# 2025-2-21

## 一、重要概念

- association 表示变量之间的所有关系，包括线性和非线性。
- correlation 专指线性相关。
- 样本方差是总体方差的无偏估计，但标准差不是（开根号后就不是了）；样本均值也是总体均值的无偏估计。
- 中位数 median 相较于均值 mean 来说，比较稳健（对于奇异值）；奇异值：在这里暂指极大极小值。
- 箱型图中通过箱体长度观察方差的大小。
- 多元统计的目标是：降维。在不损失较多数据信息的情况下，多数据降维。
- 多元数据分析分两类：探索性数据分析和验证性数据分析；探索性（图表法，描述统计量）；验证性（假设模型，假设分布）。
- 实对称矩阵非负定，对应的二次型非负。
- 相关系数 *R*：消除量纲，有意义，有界。
- 在正态情况下，不相关与独立完全等价，但其他情况下不行。
- 只有协方差阵可以决定数据是否可以降维。
- R 语言中矩阵乘积（内积）：%*%。
- 随机向量 *X*=(*X*1,*X*2,…,*X**p*) 的协方差阵 *D*(*X*)=Σ 是对称非负定矩阵。
- 幂等矩阵：*AA*=*A*；正交阵：*A**T**A*=*A**A**T*=*I**n*。
- 由 *n* 维向量组成的向量组，其秩小于等于 *n*。
- 对应于不同特征值的特征向量必线性无关。

参考链接：[Hexo支持LaTeX数学公式渲染](https://blog.kevinchu.top/2023/09/12/hexo-supports-latex/#1-前言)，解决 Hexo 数学公式渲染问题。


- 随机向量$X = (X_1，X_2，...,X_p)的协方差阵D(X)=\Sigma$是对称非负定矩阵
- 幂等矩阵：AA=A;正交阵：$A^TA=AA^T=I_n$

- 随机向量$X = (X_1，X_2，...,X_p)的协方差阵D(X)=\Sigma$是对称非负定矩阵
- 幂等矩阵：AA=A;正交阵：$A^TA=AA^T=I_n$

## 二、思考题

1、$\Sigma$推导（随机向量$X = (X_1，X_2，...,X_p)的协方差阵D(X)=\Sigma$）是对称非负定矩阵，使用矩阵代数相关知识
$$
解：Cov(X_i,X_i)=Cov(X_j,X_i),即\Sigma=\Sigma^T。满足矩阵对称性\\
$$

展开后，协方差矩阵的元素可以表示为
$$
\Sigma_{ij} = \text{Cov}(X_i, X_j) = \mathbb{E}[(X_i - \mu_i)(X_j - \mu_j)] \\
$$
具体形式如下：

<span>
$$
\Sigma = \begin{bmatrix}
\text{Var}(X_1) & \text{Cov}(X_1, X_2) & \cdots & \text{Cov}(X_1, X_n) \\
\text{Cov}(X_2, X_1) & \text{Var}(X_2) & \cdots & \text{Cov}(X_2, X_n) \\
\vdots & \vdots & \ddots & \vdots \\
\text{Cov}(X_n, X_1) & \text{Cov}(X_n, X_2) & \cdots & \text{Var}(X_n)
\end{bmatrix}\\
\\
$$
</span>

<span>
$$
cov(X,Y)=E(X-E(X)(Y-E(Y)))\\
$$
</span>

<span>
$$
\Sigma = \begin{bmatrix}
\text E(X_1-E(X)(X_1-E(X)) & \text...& \cdots & \text... \\
\text E(X_2-E(X)(X_1-E(X)) & \text... & \cdots & \text...\\
\vdots & \vdots & \ddots & \vdots \\
\text E(X_n-E(X)(X_1-E(X)) & \text... & \cdots & \text...
\end{bmatrix}\\
$$
</span>
$$
一个列向量乘以一个行向量，可以得到n\times n的矩阵。
$$
<span>
$$
\Sigma = \begin{bmatrix}E(X_1-E(X)) \\
E(X_2-E(X)) \\
\vdots \\
E(X_n-E(X))
\end{bmatrix}
\times
\begin{bmatrix}
E(X_1-E(X)) & E(X_2-E(X)) & \cdots & E(X_n-E(X))
\end{bmatrix}\\
$$

$$
=E((X-E(X))E(X-E(X))^T)
$$

</span>
$$
在二次型中如果矩阵A为p\times p的实对称矩阵时\\
$$

$$
对于x属于R^p有,Q(x)=x^TAx\\
$$

$$
同理，对于给定的a=(a_1,a_2,...,a_p)^T\\
$$

$$
a^T\Sigma a = a^TE((X-E(X))E(X-E(X))^T)a\\
$$

$$
=E(a^T(X-E(X))(X-E(X))^Ta)\\
$$

$$
=E[(a^T(X-E(X)))^2]>=0\\
$$

2、R也是非负定的
$$
[ r = \frac{\sum_{i=1}^{n} (X_i - \bar{X})(Y_i - \bar{Y})}{\sqrt{\sum_{i=1}^{n} (X_i - \bar{X})^2} \cdot \sqrt{\sum_{i=1}^{n} (Y_i - \bar{Y})^2}} ]
$$

$$
同理，我们在上面证明了Sigma是对称非负定的，显然R是对称的。\\
$$

$$
对于给定的a=(a_1,a_2,...,a_p)^T\\
$$

$$
Q(x)=a^TRa=a^T\frac{\Sigma}{\sqrt{\sigma_X}\sqrt{\sigma y}}a\\
$$


$$
我们显然可以看到对于相关系数来说：R是非负定的。
R是由\Sigma变化得来的。
$$

3、证明S是非负定的

以下是证明过程：
$$
S = \frac{1}{n-1}\Sigma_{i=1}^{n}[(x_i-\bar(x))(x_i-\bar(x))]^T=(\hat{\sigma_{lk}})_{p\times p}
$$

$$
令A=（x_i-\bar{x})^T,则S=A^TA\times  c
$$

$$
证明：易见 (A^T A) 和 (AA^T) 都是对称半正定矩阵：(\forall \mathbf{x} \in \mathbb{R}^p)，\\
$$

$$
[ \mathbf{x}^T (A^T A) \mathbf{x} = (A \mathbf{x})^T (A \mathbf{x}) = \|A \mathbf{x}\|^2 \geq 0. ]\\
$$

$$
可以证明 (\text{rank}(A) = \text{rank}(A^T A) = \text{rank}\\
$$

$$
(AA^T))。(A^T A) 和 (AA^T) 仅有非负特征值。\\
$$



即S为非负定对称阵

## 三、代码题

$$
协方差矩阵：S = \frac{1}{n-1} \sum_{i=1}^{n} (x_i - \bar{x})(x_i - \bar{x})^T
$$

```R
# 1、如何自己不通过已有函数计算cov,cor

## 伪代码如下

### 计算cov

mx <- colMeans(data)

cor(data)

cov(data)

X <- as.matrix(data)

(E <- rep(1,n))

S <- t(AA-E%*%t(mx))%*%(AA-E%*%t(mx))/51

S == cov(data)

## 计算cor

AA_centered <- AA - E %*% t(mx) # 中心化处理（减去均值）

# 计算协方差矩阵
S <- t(AA_centered) %*% AA_centered / (nrow(AA) - 1)

# 计算变量的标准差
std_dev <- sqrt(diag(S))

# 计算相关系数矩阵
cor_matrix <- S / (outer(std_dev, std_dev))

# 打印相关系数矩阵
print(cor_matrix)
```

利用矩阵代数的知识计算主要在于公式



---

# 2025-3-3

## 一、重要概念

  \- 有监督学习和无监督学习； 无监督学习：将所有变量地位看作一样，没有自变量，应变量之说：主成分，因子，聚类分析 有监督学习：变量之间的地位不一样，有响应变量和潜在预测变量区分，主要是想用预测变量去阐释响应变量的变异：回归模型 - 方差分析是回归的特例 当响应变量是连续性时：线性和非线性 当响应变量非连续：广义线性模型 生存模型：生存分析，我所感兴趣的时间发生的时间 - 有标签：判别分析；无标签：聚类分析



## 二、思考题

1、

2、

## 三、代码摘录

```R
# ----------------------------------------------------
#马氏距离函数
mahalanobis_dist <- function(x,mu,Sigma){
  t(x-mu)%*%solve(Sigma)%*%(x-mu)
}

# -------------------------------------------------------
# plotly交互式绘图
x <- seq(-4,8,length.out=60)
y <- seq(-5,7,length.out=60)
grid <- expand.grid(x=x,y=y)
# 计算二维正态分布的密度
z <- matrix(dmvnorm(grid,mean=mu,sigma = Sigma),nrow = length(x))

library(plotly)
plot_ly(x=x,y=y,z=z)|>
  add_surface()|>
  layout(
    title = "2D",
    scene = list(
      xaxis = list(title="X"),
      yaxis = list(title="Y"),
      zaxis = list(title="Z")
    )
  )

# -----------------------------------------------------
# 画等高线图函数
contour(x,y,z)

# -----------------------------------------------------
# 注意apply函数的妙用
d <- apply(X,1,function(z) t(z-mx)%*%solve(S)%*%(z-mx))
           
# -------------------------------------------------------
# shapiro检验
library(stats)
shapiro.test(x1)
# 该检验对样本容量相当敏感，对小样本比较适用
```



---

# 2025-3-6

## 重要概念

## 思考题

1、在一元正态QQ图中，$x(j)与q(j)之间的关系，也就是q(j)和N(\mu,\sigma^2)之间的关系$

![image-20250306140818225](/../source/img/image-20250306140818225.png)



<span>
$$
q(j)是N(0,1)的分位数，x(j)是N(\mu,\sigma^2)的分位数.\\
$$

$$
我们合理猜测：q(j)=ax(j)+b\\
$$


$$
\frac{x(j)-\mu}{\sigma} 
\approx q(j)\\
$$

</span>






## 代码摘录



---

# 2025-3-9

## 一、重要概念

### 主成分分析

主成分的思想：找少数新的互不相关的变量，用其替代原来大的变量，并解释其变异。是特定的线性组合（原始变量的线性组合）

至于这个变异，今天看一本书看到关于它的有趣的定义：
变异所代表的意思是同样的物件或事情，当它一再重复发生的是哦胡，不论我们如何用心测量，总是不能得到同样的结果。如生产线上的规格，绝不可能100%的合格。【来自《生活中的统计学》第一篇：万物有常，世事多变。中国统计杂志社】

在这篇文章中还有一句有趣的话：是五台山显通寺大文殊殿的一副对联

法身无去无来住寂光而不动，德相非空非有应随机以恒周。

2、主成分分析模型德表达形式与推导

3、PCA求解用到条件极值，一般使用拉格朗日乘子法

4、多元函数，梯度问题相关

5、任何一个协方差阵都是非负定阵

6、实对称矩阵中不同特征值对应德特征向量正交；在统计上便是不想关；
但是如果有重根，施密特正交化可以保证找到两个正交的向量

7、基于协方差阵和基于相关系数矩阵求解主成分的区别；
使用相关系数矩阵提取主成分：$tr(R)=p$。

8、主成分得分：PC scores是从样本出发得到的



## 二、思考题

1、主成分求解那里，使用language乘子法，有一个多元函数偏导问题：

<span>
$$
PCA求解\\
max ~~{\alpha_1}^T\Sigma{\alpha_1}\\
s.t.||{\alpha_1||=1}\\
满足：{\alpha}^T\alpha=1\\
language乘子法\\
f(\alpha_1,\lambda)={\alpha_1}^T\Sigma{\alpha_1}+\lambda({\alpha}^T\alpha-1)\\

\begin{cases}
\frac{\partial f}{\partial \alpha_1} = 0 \\
\frac{\partial f}{\partial \lambda} = 0
\end{cases}
\Rightarrow \text{?}
$$

</span>

[矩阵求导公式的数学推导（矩阵求导——基础篇） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/273729929)

【矩阵求导——标量函数的偏导数矩阵】https://www.bilibili.com/video/BV13V4y1U7qM?vd_source=8838e67ae5978eeac0d52ce6bfdfdbee

![image-20250312234725647](/../source/img/image-20250312234725647.png)

![image-20250312234812164](/../source/img/image-20250312234812164.png)

如此即可求得结果，周日记得补充该笔记公式

2、
$$
\rho_{Y_1,X_2} = \frac{e_{12} \sqrt{\lambda_1}}{\sqrt{\sigma_{22}}}是怎么推来的，可以使用R
$$
方法建议：硬推或者转为矩阵代数



## 三、代码摘录

