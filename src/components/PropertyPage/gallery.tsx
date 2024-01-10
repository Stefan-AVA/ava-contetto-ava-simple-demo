import "swiper/css"
import "swiper/css/pagination"

import { useMemo } from "react"
import Image from "next/image"
import { Unstable_Grid2 as Grid } from "@mui/material"
import { Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

interface GalleryProps {
  data: string[]
}

export default function Gallery({ data = [] }: GalleryProps) {
  const splitImages = useMemo(() => {
    const arr = [] as string[][]

    if (data.length <= 4) return [data]

    arr.push(data.slice(0, 4))

    for (let i = 4; i < data.length; i += 12) {
      arr.push(data.slice(i, i + 12))
    }

    return arr
  }, [data])

  return (
    <>
      <Swiper
        style={{ width: "100%" }}
        modules={[Pagination]}
        grabCursor
        pagination={{
          clickable: true,
        }}
        slidesPerView={1}
      >
        {splitImages.map((images, index) => (
          <SwiperSlide key={Math.random()} style={{ width: "100%" }}>
            {index === 0 && (
              <Grid sx={{ width: "100%" }} spacing={3} container>
                <Grid sm={12} md={9} sx={{ position: "relative" }}>
                  <Image
                    src={images[0]}
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Grid>

                <Grid sm={12} md={3}>
                  {[images[1], images[2], images[3]].map((url) => (
                    <Image
                      key={url}
                      src={url}
                      alt=""
                      style={{ objectFit: "cover" }}
                      width={252}
                      height={190}
                    />
                  ))}
                </Grid>
              </Grid>
            )}

            {index !== 0 && (
              <Grid sx={{ width: "100%" }} spacing={3} container>
                {images.map((image) => (
                  <Grid sm={12} md={4} lg={3} key={image}>
                    <Image
                      src={image}
                      alt=""
                      style={{ objectFit: "cover" }}
                      width={268}
                      height={154}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
