# 树图与热图的合并

> 来自论文https://www.nature.com/articles/s41467-025-61152-y

Global dissemination of npmA mediated pan-aminoglycoside resistance via a mobile genetic element in Gram-positive bacteria

这种绘制方法算是第一次见

![图示](images/WorldMap.png)

```R
library(tidyverse);library(sf);library(rnaturalearth);library(rnaturalearthdata)
library(ggspatial);library(countrycode)


# 1. Load data
npmA <- read_csv("data/Fig1.csv") %>%
  filter(QC_assemblies == "pass", study_id != "no_study") %>%
  mutate(iso_a3 = countrycode(country, 
                              origin = "country.name", 
                              destination = "iso3c"),
         count = npmA)     # assuming npmA is 0/1

centroids <- read_csv(
  "data/average-latitude-longitude-countries.csv",
  show_col_types = FALSE
) %>%
  rename(
    iso_a3    = `ISO.3166.Country.Code`,
    latitude  = Latitude,
    longitude = Longitude
  )

# 2. Summarise per country
country_counts <- npmA %>%
  group_by(iso_a3) %>%
  summarise(count = sum(count), .groups = "drop")

# 3. Prepare map
world <- ne_countries(scale = "medium", returnclass = "sf") %>%
  left_join(country_counts, by = c("iso_a3"))

world$count[is.na(world$count)] <- 0

# 4. Plot
p <- ggplot(world) +
  geom_sf(aes(fill = count), color = "grey30", size = 0.1) +
  scale_fill_gradientn(name = "n of isolates",
                       colours = colorRampPalette(RColorBrewer::brewer.pal(9, "Blues"))(100)) +
  coord_sf(expand = FALSE) +
  labs(x = "Longitude", y = "Latitude") +
  theme_minimal(base_size = 12) +
  theme(legend.position = "bottom") +
  annotation_scale(location = "bl", width_hint = 0.3) +
  annotation_north_arrow(location = "bl", which_north = "true", 
                         pad_x = unit(0.2, "in"), pad_y = unit(0.5, "in"),
                         style = north_arrow_fancy_orienteering())

p

# 5. Save
ggsave("data/Figure1_npmA_map.svg", plot = p, width = 8, height = 6, dpi = 300)

```