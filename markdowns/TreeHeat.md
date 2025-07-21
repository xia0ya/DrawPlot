# 树图与热图的合并

> 来自论文https://www.nature.com/articles/s41467-025-61152-y

Global dissemination of npmA mediated pan-aminoglycoside resistance via a mobile genetic element in Gram-positive bacteria

公众号 R语言数据分析指南 复现

![图示](images/TreeHeat.png)

```R
# 载入所需包 -------------------------------------------------------------
library(tidyverse)
library(ape)
library(ggtree)
library(treeio)
library(phytools)
library(ggnewscale)
library(aplot)

# 读入数据 ---------------------------------------------------------------
tree_f <- "data/Fig2a.treefile"
meta_f <- "data/Fig2a.csv"

tr       <- read.tree(tree_f)
meta_df  <- read_csv(meta_f, show_col_types = FALSE) |>
  filter(biosample_id %in% tr$tip.label) |>
  as.data.frame()

rownames(meta_df) <- meta_df$biosample_id
meta_df <- meta_df[, c("niche", "country", "npmA_presence",
                       "Composite_Tn", "ICE_MGE_type")]
meta_df[] <- lapply(meta_df, as.character)

# 构造树图 ---------------------------------------------------------------
p <- ggtree(midpoint.root(tr), layout = "rectangular")

# 整理热图数据 -----------------------------------------------------------
df <- meta_df |>
  rownames_to_column(var = "id") |>
  pivot_longer(-id) |>
  drop_na()

df$name <- factor(df$name, levels = unique(df$name))

# 热图 -------------------------------------------------------------------
heat <- ggplot(df, aes(name, id)) +
  # 1) niche
  geom_tile(
    data = df |>
      filter(name == "niche") |>
      rename("1.niche" = value),
    aes(fill = `1.niche`)
  ) +
  scale_fill_manual(
    values = c("Human"            = "#5CA4E6",
               "Livestock"        = "#E84A4A",
               "Companion Animal" = "#5B331B",
               "Environment"      = "#34732D",
               "Food"             = "#A259D0"),
    guide  = guide_legend(order = 1)
  ) +
  
  new_scale_fill() +
  
  # 2) country
  geom_tile(
    data = df |>
      filter(name == "country") |>
      rename("2.country" = value),
    aes(fill = `2.country`)
  ) +
  scale_fill_manual(
    values = c("Australia"      = "#F4C7DE",
               "Austria"        = "#9AC4F6",
               "Belgium"        = "#B1D1A2",
               "Canada"         = "#C1C1C1",
               "China"          = "#F9D275",
               "France"         = "#2B3C70",
               "Germany"        = "#FAE664",
               "Hungary"        = "#A9A9A9",
               "Indonesia"      = "#C1DAB4",
               "Iran"           = "#4D704D",
               "Ireland"        = "#75B9D2",
               "Italy"          = "#A1D8C8",
               "Netherlands"    = "#F79533",
               "Poland"         = "#F86BA1",
               "Portugal"       = "#D6C6CA",
               "Spain"          = "#F7A98A",
               "Switzerland"    = "#C3E27F",
               "United Kingdom" = "#B6C5DA",
               "United States"  = "#730021"),
    guide = guide_legend(order = 2)
  ) +
  
  new_scale_fill() +
  
  # 3) npmA_presence
  geom_tile(
    data = df |>
      filter(name == "npmA_presence") |>
      rename("3.npmA variant" = value),
    aes(fill = `3.npmA variant`)
  ) +
  scale_fill_manual(
    values      = c("npmA1" = "#F97A1E",
                    "npmA2" = "#2A2E82"),
    na.translate = FALSE,
    guide        = guide_legend(order = 3)
  ) +
  
  new_scale_fill() +
  
  # 4) Composite_Tn
  geom_tile(
    data = df |>
      filter(name == "Composite_Tn") |>
      rename("4.Tn7734" = value) |>
      mutate(`4.Tn7734` = case_when(
        `4.Tn7734` == "yes" ~ "Tn7734",
        TRUE                 ~ `4.Tn7734`
      )),
    aes(fill = `4.Tn7734`)
  ) +
  scale_fill_manual(
    values       = c("Tn7734"        = "#F5BE35",
                     "one_copy_IS30" = "#EBD889"),
    na.translate = FALSE,
    guide        = guide_legend(order = 4)
  ) +
  
  new_scale_fill() +
  
  # 5) ICE_MGE_type
  geom_tile(
    data = df |>
      filter(name == "ICE_MGE_type") |>
      rename("5.ICE variant" = value) |>
      mutate(`5.ICE variant` = case_when(
        `5.ICE variant` == "ICE2"  ~ "Other ICE",
        `5.ICE variant` == "ICE_v5" ~ "Other ICE",
        TRUE                        ~ `5.ICE variant`
      )),
    aes(fill = `5.ICE variant`)
  ) +
  scale_fill_manual(
    values       = c("ICE_v1"  = "#B0DBF1",
                     "ICE_v2"  = "#A0E0E0",
                     "ICE_v3"  = "#E6B7DA",
                     "ICE_v4"  = "#F97979",
                     "Other ICE" = "#1A1A1A"),
    na.translate = FALSE
  ) +
  
  scale_x_discrete(expand = c(0, 0)) +
  geom_vline(xintercept = c(1.5, 2.5, 3.5, 4.5), linewidth = 0.3) +
  theme_test() +
  theme(
    axis.text.y    = element_blank(),
    axis.ticks.y   = element_blank(),
    axis.title     = element_blank(),
    axis.text.x    = element_text(angle = 90, color = "black",
                                  vjust = 0.5, hjust = 1),
    legend.key.height = unit(0.4, "cm"),
    legend.key.width  = unit(0.4, "cm")
  )

# 合并树图与热图 ---------------------------------------------------------
heat |> insert_left(p, width = c(1, 0.4))

```