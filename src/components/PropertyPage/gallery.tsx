import "swiper/css"
import "swiper/css/navigation"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Box, Unstable_Grid2 as Grid, Modal, Paper } from "@mui/material"
import { X } from "lucide-react"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react"

interface GalleryProps {
  data: string[]
}

export default function Gallery({ data = [] }: GalleryProps) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const [showModal, setShowModal] = useState(false)

  const splitImages = useMemo(() => {
    const arr = [] as string[][]

    if (data.length <= 4) return [data]

    arr.push(data.slice(0, 4))

    for (let i = 4; i < data.length; i += 12) {
      arr.push(data.slice(i, i + 12))
    }

    return arr
  }, [data])

  function navigateToSlide(position: number) {
    setShowModal(true)

    if (swiper) swiper.slideTo(position)
  }

  function onCloseModal() {
    setShowModal(false)
  }

  return (
    <>
      <Swiper
        style={{ width: "100%" }}
        modules={[Navigation]}
        grabCursor
        navigation
        slidesPerView={1}
      >
        {splitImages.map((images, index) => (
          <SwiperSlide key={Math.random()} style={{ width: "100%" }}>
            {index === 0 && (
              <Grid sx={{ width: "100%" }} spacing={3} container>
                <Grid
                  sm={12}
                  md={9}
                  sx={{ position: "relative" }}
                  role="presentation"
                  onClick={() => navigateToSlide(0)}
                >
                  <Image
                    src={images[0]}
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Grid>

                <Grid sm={12} md={3}>
                  {[images[1], images[2], images[3]].map((url, position) => (
                    <Image
                      key={url}
                      src={url}
                      alt=""
                      role="presentation"
                      style={{ objectFit: "cover" }}
                      width={252}
                      height={190}
                      onClick={() => navigateToSlide(position + 1)}
                    />
                  ))}
                </Grid>
              </Grid>
            )}

            {index !== 0 && (
              <Grid sx={{ width: "100%" }} spacing={3} container>
                {images.map((image, position) => (
                  <Grid
                    sm={12}
                    md={4}
                    lg={3}
                    key={image}
                    role="presentation"
                    onClick={() => navigateToSlide(position + 4)}
                  >
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

      <Modal open={!!showModal} onClose={onCloseModal} keepMounted>
        <Paper
          sx={{
            p: 4,
            top: "50%",
            left: "50%",
            width: "90vw",
            height: "90vh",
            outline: "none",
            position: "absolute",
            transform: "translate(-50%, -50%)",
          }}
          variant="outlined"
        >
          <Box
            sx={{
              top: "-1.25rem",
              right: "-1.25rem",
              width: "2.5rem",
              color: "white",
              height: "2.5rem",
              bgcolor: "black",
              display: "flex",
              position: "absolute",
              alignItems: "center",
              borderRadius: "50%",
              justifyContent: "center",
            }}
            onClick={onCloseModal}
            component="button"
          >
            <X />
          </Box>

          <Swiper
            style={{ width: "100%", height: "100%" }}
            modules={[Navigation]}
            onSwiper={setSwiper}
            grabCursor
            navigation
            slidesPerView={1}
          >
            {data.map((image) => (
              <SwiperSlide
                key={image}
                style={{ width: "100%", height: "100%", position: "relative" }}
              >
                <Image src={image} alt="" fill style={{ objectFit: "cover" }} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Paper>
      </Modal>
    </>
  )
}
