import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import styles from './styles.module.css'
import {
  wrapNums,
  getVideoHeight,
  getVideoWidth,
  shouldAutoplay,
  openFullScreen,
  closeFullScreen,
} from './utility'
import {
  ZoomIn,
  ZoomOut,
  Fullscreen,
  PlayCircleFill,
  Search,
  Download,
  PauseCircleFill,
  FullscreenExit,
  XLg,
  GridFill
} from 'react-bootstrap-icons'
import ScrollContainer from 'react-indiana-drag-scroll'
import Magnifier from 'react-magnifier'
import { Portal } from 'react-portal'
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef, } from 'react-zoom-pan-pinch'
import ReactSwipe from 'react-swipe'
import { saveAs } from 'file-saver'
import Div100vh from 'react-div-100vh'
import KeyHandler from 'react-key-handler'
import { useIsomorphicLayoutEffect } from 'usehooks-ts'
import { useInterval } from 'usehooks-ts'


let thumbnailVariants: any = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 100 }
}

const themes: any = {
  day: {
    background: 'white',
    iconColor: 'black',
    thumbnailBorder: 'solid transparent 2px',
    textColor: 'black'
  },
  night: {
    background: '#151515',
    iconColor: '#626b77',
    thumbnailBorder: 'solid rgb(107, 133, 206)  2px',
    textColor: '#626b77'
  },
  lightbox: {
    background: 'rgba(12, 12, 12, 0.93)',
    iconColor: '#626b77',
    thumbnailBorder: 'solid rgb(107, 133, 206) 2px',
    textColor: 'silver'
  }
}

// const activeThumbnailBorder = 'solid rgba(107, 133, 206, 0.6) 2px'
const inactiveThumbnailBorder = 'solid transparent 2px'

const imgSwipeDirection = 'x'
const defaultTheme = 'night'
const mobileWidth = 768

interface SlideItem {
  src?: string,
  original?: string,
  type?: string,
  alt?: string,
}

interface ImageElement {
  src?: string,
  alt?: string,
  loaded?: string,
}

export const Slideshow = (props: any) => {

  const createCustomThumbnailBorder = (): string | void => {
    if (props.thumbnailBorder) {
      return `solid ${props.thumbnailBorder} 2px`
    }
  }

  const [[imgSlideIndex, direction], setImgSlideIndex] = useState([0, 0])
  const [showModal, setShowModal] = useState(false)
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(false)

  const [images, setImages] = useState<SlideItem[]>([]);

  const [magnifyingGlassFeature, _setMagnifyingGlassFeature] = useState(
    props.magnifyingGlass ? props.magnifyingGlass : false
  )

  const [disableZoom, setDisableZoom] = useState(
    props.disableImageZoom ? props.disableImageZoom : false
  )

  const [previewImageElems, setPreviewImageElems] = useState<any[]>([]);

  const slideIndex = wrapNums(0, images.length, imgSlideIndex)
  const [reactSwipeOptions, setReactSwipeOptions] = useState({
    continuous: true,
    startSlide: 0,
    stopPropagation: true
  })

  const [slideshowInterval, setSlideshowInterval] = useState(
    props.slideshowInterval ? props.slideshowInterval : 1100
  )

  const [rightArrowStyle, setRightArrowStyle] = useState(
    props.rightArrowStyle ? props.rightArrowStyle : {}
  )

  const [leftArrowStyle, setLeftArrowStyle] = useState(
    props.leftArrowStyle ? props.leftArrowStyle : {}
  )

  const [zoomedIn, setZoomedIn] = useState(false)

  const [isRounded, setIsRounded] = useState(
    props.roundedImages ? props.roundedImages : false
  )

  const [isOpen, setIsOpen] = useState(false)

  const [showControls, setShowControls] = useState(
    props.showControls ? props.showControls : true
  )

  const [displayFullScreenIcon, setDisplayFullScreenIcon] = useState(
    props.showFullScreenIcon ? props.showFullScreenIcon : true
  )

  const [displayThumbnailIcon, setDisplayThumbnailIcon] = useState(
    props.showThumbnailIcon ? props.showThumbnailIcon : true
  )

  const [displaySlideshowIcon, setDisplaySlideshowIcon] = useState(
    props.showSlideshowIcon ? props.showSlideshowIcon : true
  )

  const [displayMagnificationIcons, setDisplayMagnificationIcons] = useState(
    props.showMagnificationIcons ? props.showMagnificationIcons : true
  )

  const [nextArrowElem, setNextArrowElem] = useState(
    props.nextArrow ? props.nextArrow : null
  )

  const [prevArrowElem, setPrevArrowElem] = useState(
    props.prevArrow ? props.prevArrow : null
  )

  const [modalCloseOption, setModalCloseOption] = useState(
    props.modalClose ? props.modalClose : "default"
  )

  const [showDownloadBtn, setShowDownloadBtn] = useState(
    props.downloadImages ? props.downloadImages : false
  )

  const [isRTL, setIsRTL] = useState(props.rtl ? props.rtl : false)

  const [frameworkID, setFrameworkID] = useState(
    props.framework ? props.framework : ''
  )
  const [lightboxIdentifier, setLightboxIdentifier] = useState(
    props.lightboxIdentifier ? props.lightboxIdentifier : false
  )
  const [imageFullScreen, setImageFullScreen] = useState(
    props.fullScreen ? props.fullScreen : false
  )
  const [licenseKey, setLicenseKey] = useState(
    props.licenseKey ? props.licenseKey : ''
  )
  const [showLoader, setShowLoader] = useState(
    props.showLoader ? props.showLoader : false
  )

  const [displayLoader, setDisplayLoader] = useState(
    props.showLoader ? props.showLoader : false
  )

  const [videoCurrentlyPlaying, setVideoCurrentlyPlaying] = useState(false)

  const [width, setWidth] = useState(0)

  const [isBrowserFullScreen, setIsBrowserFullScreen] = useState(false)
  const [enableMagnifyingGlass, setMagnifyingGlass] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [refIndex, setRefIndex] = useState(0)

  const imageRef: React.RefObject<HTMLImageElement> = useRef(null)

  const [zoomIdx, setZoomIdx] = useState(0)

  const [imgContainHeight, setImgContainHeight] = useState(500)
  const [imgContainWidth, setImgContainWidth] = useState(426)
  const [isInit, setIsInit] = useState(false)

  // Refs
  const zoomRef = useRef(null)
  const [zoomBtnRef, setZoomBtnRef] = useState(null)
  const [zoomRefs, setZoomRefs] = useState([])
  const zoomReferences = useRef<(ReactZoomPanPinchRef | null)[]>([])

  const videoReferences = useRef({})

  // Styling/theming
  const [backgroundColor, setBackgroundColor] = useState(
    props.backgroundColor
      ? props.backgroundColor
      : themes[defaultTheme].background
  )
  const [iconColor, setIconColor] = useState(
    props.iconColor ? props.iconColor : null
  )
  const [textColor, setTextColor] = useState(
    props.textColor ? props.textColor : themes[defaultTheme].textColor
  )

  const [coverMode, setCoverMode] = useState(
    props.useCoverMode ? props.useCoverMode : false
  )

  const [thumbnailBorder, setThumbnailBorder] = useState(
    props.thumbnailBorder
      ? createCustomThumbnailBorder()
      : themes[defaultTheme].thumbnailBorder
  )

  const [showThumbnails, setShowThumbnails] = useState(
    props.showThumbnails ? props.showThumbnails : false
  )
  const [animatedThumbnails, setAnimatedThumbnails] = useState(
    props.animateThumbnails ? props.animateThumbnails : true
  )
  const [imgAnimation, setImgAnimation] = useState(
    props.imgAnimation ? props.imgAnimation : 'imgDrag'
  )
  const [arrowStyle, setArrowStyle] = useState(
    props.arrowStyle ? props.arrowStyle : 'dark'
  )

  const isMobile = width <= mobileWidth;

  const initZoomRef = (ref) => {
    if (ref) setZoomBtnRef(ref)
    else setZoomBtnRef(null)
  }

  const getLoaderThemeClass = () => {
    if (props.theme) {
      if (props.theme == 'night' || props.theme == 'lightbox') {
        return styles.night_loader
      } else if (props.theme == 'day') {
        return styles.day_loader
      }
    }
    return styles.night_loader
  }

  const wheelEvent: (ref: ReactZoomPanPinchRef, event: WheelEvent) => void = (ref, e) => {
    setImgAnimation('fade')
    // setLockAxisY(false)
  }

  const zoomEvent = (ref, e) => {
    if (ref.state.scale == 1) {
      setImgAnimation('imgDrag')
      // setImgSwipeMotion(imgSwipeDirection)
      setZoomedIn(false)
    } else {
      // setImgAnimation("fade");
      setZoomedIn(true)
    }
  }

  const isImageCaption = () => {
    if (props.images && props.images[slideIndex].caption) {
      return true
    }
    return false
  }

  const displayDownloadBtn = () => {
    if (isVideo(slideIndex)) {
      return false
    } else {
      return showDownloadBtn
    }
  }

  function handleWindowResize() {
    setWidth(window.innerWidth)
  }

  const shouldDisplayMagnifyingGlassIcon = () => {
    if (isVideo(slideIndex)) {
      return false
    }
    if (isMobile == true) {
      return false
    }
    if (imageFullScreen == true) {
      return false
    }

    if (magnifyingGlassFeature == true) {
      return true
    }
    return false
  }

  const getImageStyle = () => {
    let styleObject = {};
    if (isRounded) {
      styleObject["borderRadius"] = "20px";
    }
    if (modalCloseOption == "clickOutside") {
      styleObject["pointerEvents"] = "auto"
    }
    return styleObject;
  }

  const shouldDisplaySlideshowIcon = () => {
    if (images) {
      if (images.length == 1) {
        return false;
      }
    }
    else if (props.images) {
      if (props.images.length == 1) {
        return false;
      }
    }
    return true;
  }

  const thumbnailClick = (index) => {
    initLoader(index)
    resetVideo()
    resetImage()
    setCurrentSlide(index)
  }

  const checkModalClick = (e) => {
    const modals = document.getElementsByClassName('imageModal')
    let arr_modals = Array.from(modals)
    for (let i = 0; i < arr_modals.length; i++) {
      let elem = arr_modals[i]
      let clickInside = elem.contains(e.target);

      if (clickInside) {
        return
      }
    }

    closeModal()
  }

  const getRTLIndex = (img_gallery_length, i) => {
    let index
    if (i == 0) {
      index = img_gallery_length - 1
    } else if (i == img_gallery_length - 1) {
      index = 0
    } else {
      index = img_gallery_length - i - 1
    }
    return index
  }

  const getIconColor = () => {
    if (props.theme) {
      if (themes[props.theme]) {
        return themes[props.theme].iconColor;
      }
    }
    else {
      return themes[defaultTheme].iconColor;
    }
  }

  const fullScreen = () => {
    let lightbox = document.getElementById('slideshowAnim')
    openFullScreen(lightbox)
    setIsBrowserFullScreen(true)
    initFullScreenChangeEventListeners()
  }

  const exitFullScreenHandler = () => {
    //in full screen mode
    if (
      document['webkitIsFullScreen'] ||
      document['mozFullScreen'] ||
      document['msFullscreenElement']
    ) {
      setIsBrowserFullScreen(true)
    } else {
      if (isBrowserFullScreen) {
        closeFullScreen(document)
      }
      removeFullScreenChangeEventListeners()
      setIsBrowserFullScreen(false)
    }
  }

  const exitFullScreen = () => {
    closeFullScreen(document)
    removeFullScreenChangeEventListeners()
    setIsBrowserFullScreen(false)
  }

  const updateImageSlideshow = (newDirection) => {
    if (isRTL) {
      reactSwipeEl.prev()
    } else {
      reactSwipeEl.next()
    }

    setImgSlideIndex([imgSlideIndex + newDirection, newDirection])
    if (isRTL) {
      setRefIndex(refIndex - 1)
      setZoomIdx(zoomIdx - 1 < 0 ? images.length - 1 : zoomIdx - 1)
    } else {
      setZoomIdx(zoomIdx + 1 >= images.length ? 0 : zoomIdx + 1)
      setRefIndex(refIndex + 1)
    }
  }

  const displayArrows = () => {
    if (props.showArrows == false) {
      return false;
    }
    else if (images.length == 1) {
      return false;
    }
    if (props.images) {
      if (props.images.length == 1) {
        return false;
      }
    }
    return true;
  }

  const initLoader = (newIndex) => {
    if (props.showLoader && props.images) {
      if (!isVideo(newIndex) && images[newIndex]['loaded'] != true) {
        setDisplayLoader(true)
      } else if (
        props.showLoader &&
        props.images &&
        images[newIndex]['loaded']
      ) {
        setDisplayLoader(false)
      }
    }
  }

  const getImageCaption = (): string => {
    if (props.images) {
      return props.images[slideIndex].caption;
    }
    return ""
  }

  const getArrowStyle = (): string | void => {
    if (arrowStyle == 'dark') {
      return styles.dark_icon
    } else if (arrowStyle == 'light') {
      return styles.light_icon
    }
  }

  const getIconStyle = (): string | undefined => {
    if (arrowStyle == 'dark') {
      return styles.dark_header_icon
    } else if (arrowStyle == 'light') {
      return styles.light_header_icon
    }
  }

  const setCurrentSlide = (newIndex) => {
    let newDirection
    if (newIndex > imgSlideIndex) {
      newDirection = 1
    } else {
      newDirection = -1
    }

    setZoomIdx(newIndex)

    setImgSlideIndex([newIndex, newDirection])
    reactSwipeEl.slide(newIndex, 500)
  }

  const dispatchOpenEvent = () => {
    if (props.onOpen) {
      props.onOpen();
    }
  }

  const dispatchCloseEvent = () => {
    if (props.onClose) {
      props.onClose()
    }
  }

  const closeModal = () => {
    //reset zoom ref
    setZoomIdx(0)

    if (isBrowserFullScreen) {
      exitFullScreen()
    }

    // ensure slideshow is paused
    if (isSlideshowPlaying) {
      setIsSlideshowPlaying(false)
    }

    setShowModal(false)
    setIsOpen(false)

  }

  const openModal = (num) => {
    setImgSlideIndex([num, 1])
    setShowModal(true)
    setIsOpen(true)
  }

  const setItemLoaded = (index) => {
    if (props.images) {
      images[index]['loaded'] = true
      setImages(images)
    }
  }

  const setImagesItemLoaded = (index) => {
    let imgs: SlideItem[] = images
    imgs[index]['loaded'] = true
    setImages(imgs)
  }

  const nextSlide = () => {
    initLoader((imgSlideIndex + 1) % images.length)
    resetVideo()
    resetImage()
    reactSwipeEl.next()
    setRefIndex(refIndex + 1)
    setImgSlideIndex([imgSlideIndex + 1, 1])
    setZoomIdx(zoomIdx + 1 >= images.length ? 0 : zoomIdx + 1)
  }

  const prevSlide = () => {
    initLoader((imgSlideIndex - 1) % images.length)
    resetVideo()
    resetImage()
    reactSwipeEl.prev()
    setRefIndex(refIndex - 1)
    setZoomIdx(zoomIdx - 1 < 0 ? images.length - 1 : zoomIdx - 1)
    setImgSlideIndex([imgSlideIndex - 1, 1])
  }

  const pauseVideo = () => {
    if (videoCurrentlyPlaying) {
      if (videoReferences.current[slideIndex]) {
        videoReferences.current[slideIndex].pause()
      }
    }
    setVideoCurrentlyPlaying(false)
  }

  const openModalWithSlideNum = (index) => {
    let reactSwipeOptionConfig = reactSwipeOptions
    reactSwipeOptionConfig.startSlide = index
    setReactSwipeOptions(reactSwipeOptionConfig)
    setZoomIdx(index)
    openModal(index)
  }

  const saveImage = () => {
    if (props.images.length > 0) {
      if (props.images[slideIndex].original) {
        saveAs(props.images[slideIndex].original, 'image.jpg')
      } else {
        saveAs(props.images[slideIndex]['src'], 'image.jpg')
      }
    } else {
      if (images[slideIndex].src) {
        saveAs(images[slideIndex].src!, 'image.jpeg')

      }
    }
  }

  const playSlideshow = () => {
    setMagnifyingGlass(false)
    if (isRTL) {
      updateImageSlideshow(-1)
    } else {
      updateImageSlideshow(1)
    }
    setIsSlideshowPlaying(true)
  }

  const stopSlideshow = () => {
    setIsSlideshowPlaying(false)
  }

  const resetVideo = () => {
    if (videoCurrentlyPlaying) {
      pauseVideo()
    }
    if (props.images) {
      if (props.images[slideIndex].type == 'yt') {
        let elem = props.images[slideIndex]
        videoReferences.current[
          slideIndex
        ].src = `https://www.youtube.com/embed/${elem.videoID}?${shouldAutoplay(elem) ? 'autoplay=1' : ''
        }`
      }
    }
  }

  const resetImage = () => {
    if (enableMagnifyingGlass) {
      initMagnifyingGlass()
    } else {
      if (zoomReferences.current[zoomIdx] != null) {
        zoomReferences.current[zoomIdx]!.resetTransform()
      }
    }
  }

  const getThumbnailImgSrc = (img, index) => {
    if (isVideo(index) && img.thumbnail) {
      return img.thumbnail
    } else {
      return img.src
    }
  }

  const getThumbnailImgSrcNext = (img, index) => {
    if (isVideo(index)) {
      return img.thumbnail
    } else {
      let img_src = img.src
      if (
        typeof img_src === 'object' &&
        !Array.isArray(img_src) &&
        img_src !== null
      ) {
        return img_src.src
      } else {
        return img_src
      }
    }
  }

  const initWrapperClassname = () => {
    return styles.lightboxjs
  }

  const initStyling = () => {
    if (props.theme) {
      if (themes[props.theme]) {
        setBackgroundColor(themes[props.theme].background)
        // setIconColor(themes[props.theme].iconColor)
        // setThumbnailBorder(themes[props.theme].thumbnailBorder)
        setTextColor(themes[props.theme].textColor)
      }
    }

    if (props.fullScreen) {
      if (props.fullScreen == true) {
        setImgAnimation('fade')
        setIsRounded(false)
      }
    }
  }

  const imageSlideElement = (index) => {
    let imageElem
    if (!props.images) {
      imageElem = (
        <img
          className={`${props.fullScreen
            ? styles.fullScreenLightboxImg
            : styles.lightbox_img
            } 
            ${enableMagnifyingGlass
              ? ' maxWidthFull'
              : ' maxWidthWithoutMagnifier'
            } imageModal`}
          style={getImageStyle()}
          ref={imageRef}
          loading='lazy'
          src={
            images[index].original ? images[index].original : images[index].src
          }
          onLoad={() => {
            if (index == slideIndex) {
              setDisplayLoader(false)
            }

            if (props.images) {
              setItemLoaded(index)
            } else {
              setImagesItemLoaded(index)
            }
          }}
          id='img'
        />
      )
    } else if (props.images && props.render) {
      imageElem = props.render.imgSlide(props.images[index])
    } else {
      let img_link

      // check if object (Next.js local image imports are passed as objects with a src attribute)
      if (props.images) {
        if (
          typeof props.images[index].src === 'object' &&
          !Array.isArray(props.images[index].src) &&
          props.images[index].src !== null
        ) {
          img_link = props.images[index].src.src
        } else if (props.coverImageInLightbox == true) {
          img_link = images[index].src
        } else {
          img_link = props.images[index].src
        }
      }

      imageElem = (
        <img
          className={`${props.fullScreen
            ? styles.fullScreenLightboxImg
            : styles.lightbox_img
            } 
            ${enableMagnifyingGlass
              ? ' maxWidthFull'
              : ' maxWidthWithoutMagnifier'
            } imageModal`}
          ref={imageRef}
          loading='lazy'
          style={getImageStyle()}
          src={
            props.images[index].original
              ? props.images[index].original
              : img_link
          }
          onLoad={() => {
            if (index == slideIndex) {
              setDisplayLoader(false)
            }

            if (props.images) {
              setItemLoaded(index)
            } else {
              setImagesItemLoaded(index)
            }
          }}
          id='img'
        />
      )
    }

    return imageElem
  }

  const isVideo = (index) => {
    if (props.images) {
      let elem = props.images[index]
      if (elem) {
        if (elem.type == 'yt' || elem.type == 'htmlVideo') {
          return true
        }
      }
    }

    return false
  }

  const isHTMLVideo = (index) => {
    if (props.images) {
      if (props.images && props.images[index].type == 'htmlVideo') {
        return true
      }
    }

    return false
  }

  const videoSlideElement = (elem, index) => {
    let videoElem
    if (elem.type == 'yt') {
      videoElem = (
        <div className={`${styles.videoOuterContainer} imageModal`}>
          <iframe
            className={`${styles.ytVideo}`}
            width={getVideoWidth(elem)}
            height={getVideoHeight(elem)}
            ref={(el) => (videoReferences.current[index] = el)}
            src={`https://www.youtube.com/embed/${elem.videoID}?${shouldAutoplay(elem) ? 'autoplay=1' : ''
              }`}
            title='YouTube video player'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            allowFullScreen
            onLoad={() => {
              if (index == slideIndex) {
                setDisplayLoader(false)
              }
              setItemLoaded(index)
            }}
          ></iframe>
        </div>
      )
    } else if (elem.type == 'htmlVideo') {
      videoElem = (
        <div
          className={`${styles.htmlVideo} ${styles.htmlVideoOuterContainer} imageModal`}
        >
          <video
            className={`${styles.cursorPointer} ${styles.lightboxVideo}`}
            width={getVideoWidth(elem)}
            ref={(el) => (videoReferences.current[index] = el)}
            onPlay={() => {
              setVideoCurrentlyPlaying(true)
            }}
            height={getVideoHeight(elem)}
            autoPlay={index == imgSlideIndex ? shouldAutoplay(elem) : false}
            controls
          >
            <source
              src={elem.videoSrc}
              type='video/mp4'
              onLoad={() => {
                setItemLoaded(index)
              }}
            />
          </video>
        </div>
      )
    }

    return videoElem
  }

  const regularImgPaneNodes = Array.apply(null, Array(images.length)).map(
    (_, index) => {
      return (
        <div key={index}>
          {enableMagnifyingGlass == true ? (
            <Magnifier
              src={images[index].src!}
              className={`${styles.magnifyWrapper} ${styles.lightbox_img}`}
              height={imgContainHeight}
              width={imgContainWidth}
              mgShowOverflow={false}

            />
          ) : (
            <div className={`${styles.slidePane}`}>
              <TransformWrapper
                ref={(el) => (zoomReferences.current[index] = el)}
                onWheel={wheelEvent}
                disabled={disableZoom}
                key={index}
                onZoom={zoomEvent}
                centerZoomedOut={true}
                initialScale={1}
              >
                <TransformComponent
                  wrapperStyle={{
                    width: '100vw',
                    height: '100vh',
                    margin: 'auto'
                  }}
                  contentStyle={
                    props.fullScreen
                      ? {
                        width: '100vw',
                        height: '100vh',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                      }
                      : {
                        width: '100vw',
                        height: '100vh',
                        margin: 'auto',
                        display: 'grid'
                      }
                  }
                  key={index}
                >
                  <div
                    className={`${props.fullScreen
                      ? styles.slideshow_img_fullscreen
                      : styles.slideshow_img
                      } ${props.lightboxImgClass}`}
                  >
                    {isVideo(index) ? (
                      videoSlideElement(props.images[index], index)
                    ) : (props.images && props.render) ||
                      frameworkID == 'next' ? (
                      imageSlideElement(index)
                    ) : (
                      <img
                        className={`imageModal 
                        ${props.fullScreen
                          ? styles.fullScreenLightboxImg
                          : styles.lightbox_img
                          } 
                        ${enableMagnifyingGlass
                            ? styles.maxWidthFull
                            : styles.maxWidthWithoutMagnifier
                          } `}
                        ref={imageRef}
                        loading='lazy'
                        style={getImageStyle()}
                        src={
                          props.images && props.images[index].original
                            ? props.images[index].original
                            : images[index].src
                        }
                        onLoad={() => {
                          if (index == slideIndex) {
                            setDisplayLoader(false)
                          }

                          if (props.images) {
                            setItemLoaded(index)
                          } else {
                            setImagesItemLoaded(index)
                          }
                        }}
                        id='img'
                      />
                    )}
                  </div>
                </TransformComponent>
              </TransformWrapper>
            </div>
          )}
        </div>
      )
    }
  )

  const initMagnifyingGlass = () => {
    if (!enableMagnifyingGlass) {
      initImageDimensions()
    } else {
      setImgAnimation('imgDrag')
    }
    setMagnifyingGlass(!enableMagnifyingGlass)
  }

  const initImageDimensions = () => {
    let img
    if (imgSlideIndex == 0 || imgSlideIndex % images.length == 0) {
      img = document.getElementById('img')
    } else {
      img = imageRef.current
    }

    var ratio = img.naturalWidth / img.naturalHeight
    var width = img.height * ratio
    var height = img.height
    if (width > img.width) {
      width = img.width
      height = img.width / ratio
    }

    setImgContainHeight(height)
    setImgContainWidth(width)
  }


  const initFullScreenChangeEventListeners = () => {
    document.addEventListener('fullscreenchange', exitFullScreenHandler)
    document.addEventListener('webkitfullscreenchange', exitFullScreenHandler)
    document.addEventListener('MSFullscreenChange', exitFullScreenHandler)
    document.addEventListener('mozfullscreenchange', exitFullScreenHandler)
  }

  const removeFullScreenChangeEventListeners = () => {
    document.removeEventListener('fullscreenchange', exitFullScreenHandler)
    document.removeEventListener(
      'webkitfullscreenchange',
      exitFullScreenHandler
    )
    document.removeEventListener('MSFullscreenChange', exitFullScreenHandler)
    document.removeEventListener('mozfullscreenchange', exitFullScreenHandler)
  }

  const initEventListeners = () => {
    if (isBrowser()) {
      window.addEventListener('resize', handleWindowResize)
    }
  }

  const removeEventListeners = () => {
    if (isBrowser()) {
      window.removeEventListener('resize', handleWindowResize)
    }
  }

  const setReducedMotion = (mediaQuery) => {
    if (mediaQuery.matches) {
      setImgAnimation('fade')
    }
  }

  // Check if the user has a preference for reduced motion
  // If so, the image animation transitions between slides in the slideshow will be adjusted
  // to account for this
  const checkAndInitReducedMotion = () => {
    let reducedMotionMediaQuery: any = ''

    if (isBrowser()) {
      reducedMotionMediaQuery = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      )

      if (!reducedMotionMediaQuery || reducedMotionMediaQuery.matches) {
        setImgAnimation('fade')
      }

      reducedMotionMediaQuery.addEventListener(
        'change',
        setReducedMotion(reducedMotionMediaQuery)
      )
    }

    return reducedMotionMediaQuery
  }

  const initPropsForControlIcons = () => {
    if (props.showFullScreenIcon != undefined) {
      setDisplayFullScreenIcon(props.showFullScreenIcon)
    }
    if (props.showThumbnailIcon != undefined) {
      setDisplayThumbnailIcon(props.showThumbnailIcon)
    }

    if (props.showSlideshowIcon != undefined) {
      setDisplaySlideshowIcon(props.showSlideshowIcon)
    }

    if (props.showMagnificationIcons != undefined) {
      setDisplayMagnificationIcons(props.showMagnificationIcons)
    }
  }

  const initProps = () => {
    if (props.showControls != undefined) {
      setShowControls(props.showControls)
    }

    initPropsForControlIcons()

    if (props.disableImageZoom) {
      setDisableZoom(props.disableImageZoom)
    }

    if (isBrowser()) {
      setWidth(window.innerWidth)
    }

    if (window.innerWidth <= mobileWidth) {
      setImgAnimation('fade')
    }
  }


  // Slideshow feature; if isSlideshowPlaying set to true, then slideshow cycles through images
  useInterval(
    () => {
      if (isRTL) {
        updateImageSlideshow(-1)
      } else {
        updateImageSlideshow(1)
      }
    },

    // Delay in milliseconds or null to stop it
    isSlideshowPlaying ? slideshowInterval : null
  )

  const openFullScreen = (lightbox_elem) => {
    if (lightbox_elem.requestFullscreen) {
      lightbox_elem.requestFullscreen();
    }

    /* Safari */
    else if (lightbox_elem.webkitRequestFullscreen) {
      lightbox_elem.webkitRequestFullscreen();
    }

    /* Internet Explorer */
    else if (lightbox_elem.msRequestFullscreen) {
      lightbox_elem.msRequestFullscreen();
    }
  }

  const closeFullScreen = (document) => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }

    /* Safari */
    else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }

    /* Internet Explorer */
    else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  const isBrowser = () => typeof window !== "undefined"

  const initRTLImages = () => {
    // flip images array
    let imagesMetadataCopy = props.images
    imagesMetadataCopy.reverse()

    setImages(imagesMetadataCopy)

    if (images.length > 0) {
      let imagesRTLCopy = images
      imagesRTLCopy.reverse()
      setImages(imagesRTLCopy)
    }
  }


  const initImages = (isMounted, updateImages) => {
    if (coverMode && props.images) {
      if (props.coverImageInLightbox == false) {
        let filterImages = props.images.filter((img) => img.cover != true)
        setImages(filterImages)
      } else {
        setImages(props.images)
      }
    }

    if (updateImages || !isInit) {
      if (lightboxIdentifier && props.children) {
        let img_gallery: NodeListOf<HTMLImageElement> = document.querySelectorAll(
          `[data-lightboxjs=${lightboxIdentifier}]`
        )

        let img_elements: ImageElement[] = []
        if (img_gallery.length > 0) {
          for (let i = 0; i <= img_gallery.length - 1; i++) {
            let img = img_gallery[i]

            let attr_val = img.getAttribute('data-lightboxjs')
            if (attr_val == lightboxIdentifier) {
              img.addEventListener(
                'click',
                () => {
                  let index

                  if (isRTL) {
                    index = getRTLIndex(img_gallery.length, i)
                  } else {
                    index = i
                  }

                  let reactSwipeOptionConfig = reactSwipeOptions
                  reactSwipeOptionConfig.startSlide = index

                  if (isMounted) setReactSwipeOptions(reactSwipeOptionConfig)
                  setZoomIdx(index)
                  openModal(index)
                },
                false
              )
              img.classList.add('cursor-pointer')

              if (img.src) {
                img_elements.push({
                  src: img.src,
                  alt: img.alt,
                  loaded: 'false'
                })
              } else if (img.tagName == 'DIV') {
                let corresponding_img_item = props.images[i]
                let img_src = corresponding_img_item.src
                let img_alt = corresponding_img_item.alt
                img_elements.push({
                  src: img_src,
                  alt: img_alt,
                  loaded: 'false'
                })
              }
            }
          }
          if (isMounted && !coverMode) { setImages(img_elements) }
        }
        else {
          if (props.images) {
            setImages(props.images)
          }
        }
      }
      else if (lightboxIdentifier && props.images && !props.children) {
        setImages(props.images)
      }
      else if (!lightboxIdentifier && props.images && !props.children) {
        setImages(props.images)
      }

      // otherwise, if no lightbox identifier or custom render method
      else if (!props.render) {
        let imgArray: any = [];
        // only one image
        if (!Array.isArray(props.children)) {
          imgArray.push(props.children);
        }

        // multiple images
        else {
          imgArray = props.children;
        }

        let imgs: ImageElement[] = []
        for (let k = 0; k < imgArray.length; k++) {
          let img_elem = imgArray[k]
          let img_obj = {
            src: img_elem.props.src,
            alt: img_elem.props.alt,
            loaded: 'false'
          }
          imgs.push(img_obj)
        }
        if (isRTL) {
          imgs.reverse()
        }
        if (isMounted) setImages(imgs)

        setPreviewImageElems(imgArray)

      } else {
        if (isMounted) { setImages(props.images) }

      }

      if (isMounted) setIsInit(true)
    }


  }

  useEffect(() => {
    initImages(true, true)
  }, [props.images]);

  useEffect(() => {
    let slideNum = 0;
    if (props.open) {
      if (props.startingSlideIndex) {
        if (props.startingSlideIndex < images.length && (props.startingSlideIndex >= 0)) {
          slideNum = props.startingSlideIndex;
        }
        else {
          slideNum = 0
        }
      }

      openModalWithSlideNum(slideNum)

    }
    else if (props.open == false) {
      closeModal()
    }
  }, [props.open]);

  useEffect(() => {
    if (isOpen == true) {
      dispatchOpenEvent()
    }
    else {
      dispatchCloseEvent()
    }

  }, [isOpen])

  useEffect(() => {

    // Error check
    if (props.render) {
      if (!props.images) {
        console.error(
          'Array of images must be passed to `SlideshowLightbox` (with the `images` prop) if using custom render method. '
        )
      }
    }

    let isMounted = true
    if (isMounted) initProps()

    if (coverMode && props.images) {
      if (props.coverImageInLightbox == false) {
        let filterImages = props.images.filter((img) => img.cover != true)
        setImages(filterImages)
      } else {
        setImages(props.images)
      }
    }

    if (isMounted) {
      initEventListeners()
    }

    let reducedMotionMediaQuery = checkAndInitReducedMotion()

    if (!isInit) {
      initImages(isMounted, false);

      if (props.images && isRTL == true) {
        initRTLImages();
      }
    }

    if (isMounted) initStyling()

    return () => {
      isMounted = false
      removeEventListeners()
      reducedMotionMediaQuery.removeEventListener(
        'change',
        reducedMotionMediaQuery
      )
    }
  }, [])


  var reactSwipeEl

  return <div>
    <div className={`${initWrapperClassname()}`}>
      {props.images && props.children && lightboxIdentifier == false
        ? props.children
        : null}

      {props.images && lightboxIdentifier == false
        ? props.images.map((elem, index) => (
          <div className={props.className ?? ""}>
          <img
            className={`${styles.cursorPointer}`}
            src={elem.src}
            // src={isSrcStr(elem.src) ? elem.src : elem.src.src}
            onClick={() => {
              let img_index

              if (isRTL) {
                img_index = getRTLIndex(props.images.length, index)
              } else {
                img_index = index
              }

              openModalWithSlideNum(img_index)
            }}
            key={index}
          />
          </div>
        ))
        : null}

      {/* IF Lightbox identifier provided or props.images provided AND props.children */}
      {lightboxIdentifier != false && props.children && coverMode == false
        ? props.children
        : null}

      {/* {lightboxIdentifier != false && !props.children && coverMode == false
        ? <h1>images</h1>
        : null} */}

      {(lightboxIdentifier == false && props.images) || coverMode == true
        ? null
        : // No lightbox identifier provided or no cover mode
        previewImageElems
          .filter((elem) => elem.type == 'img')
          .map((elem, index) => (
            <div className={props.className ?? ""}>
            <img
              {...elem.props}
              className={`${elem.props.className ? elem.props.className : ''
                } ${styles.cursorPointer}`}
              onClick={() => {
                let img_index

                if (isRTL) {
                  img_index = getRTLIndex(previewImageElems.length, index)
                } else {
                  img_index = index
                }

                openModalWithSlideNum(img_index)
              }}
              key={index}
            />
            </div>
          ))}

      {coverMode ? props.children : false}
      <AnimateSharedLayout type='crossfade'>
        <AnimatePresence initial={false}>
          {showModal !== false && (
            <Portal>
              <Div100vh>
                <motion.div
                  className={`${styles.slideshowAnimContainer}`}
                  key='slideshowAnimContainer'
                  id='slideshowAnim'
                  style={{
                    backgroundColor: backgroundColor
                  }}
                  initial={{ opacity: 0, scale: 0.98 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.2
                  }}
                >
                  <div className={`${styles.lightboxContainer}`} onClick={(e) => {if (modalCloseOption == "clickOutside") {checkModalClick(e)}}}>
                    <section
                      className={`${styles.iconsHeader} ${iconColor ? '' : getIconStyle()
                        } imageModal`}
                      style={{ color: iconColor }}
                    >
                      <KeyHandler
                        keyValue={'ArrowLeft'}
                        code={'37'}
                        onKeyHandle={() => {
                          prevSlide()
                        }}
                      />
                      <KeyHandler
                        keyValue={'ArrowRight'}
                        code={'39'}
                        onKeyHandle={() => {
                          nextSlide()
                        }}
                      />
                      <KeyHandler
                        keyValue={'Escape'}
                        code={'27'}
                        onKeyHandle={() => {
                          if (!isBrowserFullScreen) {
                            closeModal()
                          }
                        }}
                      />

                      {/* Support for Internet Explorer and Edge key values  */}
                      <KeyHandler
                        keyValue={'Left'}
                        code={'37'}
                        onKeyHandle={() => {
                          prevSlide()
                        }}
                      />
                      <KeyHandler
                        keyValue={'Right'}
                        code={'39'}
                        onKeyHandle={() => {
                          nextSlide()
                        }}
                      />
                      <KeyHandler
                        keyValue={'Esc'}
                        code={'27'}
                        onKeyHandle={() => {
                          if (!isBrowserFullScreen) {
                            closeModal()
                          }
                        }}
                      />

                      {showControls && (
                        <div className={`${styles.controls}`}>
                          {disableZoom ||
                            displayMagnificationIcons == false ? null : (
                            <motion.div>
                              <svg onClick={() => {
                                if (enableMagnifyingGlass) {
                                  initMagnifyingGlass()
                                }
                                if (zoomReferences.current[zoomIdx] != null) {
                                  zoomReferences.current[zoomIdx]!.zoomIn()
                                }
                              }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 2.75C6.66751 2.75 2.75 6.66751 2.75 11.5C2.75 16.3325 6.66751 20.25 11.5 20.25C16.3325 20.25 20.25 16.3325 20.25 11.5C20.25 6.66751 16.3325 2.75 11.5 2.75ZM1.25 11.5C1.25 5.83908 5.83908 1.25 11.5 1.25C17.1609 1.25 21.75 5.83908 21.75 11.5C21.75 14.0605 20.8111 16.4017 19.2589 18.1982L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L18.1982 19.2589C16.4017 20.8111 14.0605 21.75 11.5 21.75C5.83908 21.75 1.25 17.1609 1.25 11.5ZM11.5 6.75C11.9142 6.75 12.25 7.08579 12.25 7.5V10.75H15.5C15.9142 10.75 16.25 11.0858 16.25 11.5C16.25 11.9142 15.9142 12.25 15.5 12.25H12.25V15.5C12.25 15.9142 11.9142 16.25 11.5 16.25C11.0858 16.25 10.75 15.9142 10.75 15.5V12.25H7.5C7.08579 12.25 6.75 11.9142 6.75 11.5C6.75 11.0858 7.08579 10.75 7.5 10.75H10.75V7.5C10.75 7.08579 11.0858 6.75 11.5 6.75Z" fill="white"/>
                              </svg>
                            </motion.div>
                          )}

                          {disableZoom ||
                            displayMagnificationIcons == false ? null : (
                            <motion.div>
                              <svg onClick={() => {
                                zoomReferences.current[zoomIdx]!.zoomOut()
                              }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 2.75C6.66751 2.75 2.75 6.66751 2.75 11.5C2.75 16.3325 6.66751 20.25 11.5 20.25C16.3325 20.25 20.25 16.3325 20.25 11.5C20.25 6.66751 16.3325 2.75 11.5 2.75ZM1.25 11.5C1.25 5.83908 5.83908 1.25 11.5 1.25C17.1609 1.25 21.75 5.83908 21.75 11.5C21.75 14.0605 20.8111 16.4017 19.2589 18.1982L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L18.1982 19.2589C16.4017 20.8111 14.0605 21.75 11.5 21.75C5.83908 21.75 1.25 17.1609 1.25 11.5ZM15.5 12.25C15.9142 12.25 16.25 11.9142 16.25 11.5C16.25 11.0858 15.9142 10.75 15.5 10.75H7.5C7.08579 10.75 6.75 11.0858 6.75 11.5C6.75 11.9142 7.08579 12.25 7.5 12.25H15.5Z" fill="white"/>
                              </svg>
                            </motion.div>
                          )}

                          {displayDownloadBtn() ? (
                              <svg onClick={() => {
                                saveImage()
                              }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20H19V18H5V20ZM19 9H15V3H9V9H5L12 16L19 9Z" fill="white"/>
                              </svg>
                          ) : null}


                          {displayThumbnailIcon ? (
                            <motion.div>
                              <svg onClick={() => {
                                setShowThumbnails(!showThumbnails)
                              }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 4C2 2.89543 2.89543 2 4 2H8C9.10457 2 10 2.89543 10 4V8C10 9.10457 9.10457 10 8 10H4C2.89543 10 2 9.10457 2 8V4Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
                                <path d="M14 4C14 2.89543 14.8954 2 16 2H20C21.1046 2 22 2.89543 22 4V8C22 9.10457 21.1046 10 20 10H16C14.8954 10 14 9.10457 14 8V4Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
                                <path d="M2 16C2 14.8954 2.89543 14 4 14H8C9.10457 14 10 14.8954 10 16V20C10 21.1046 9.10457 22 8 22H4C2.89543 22 2 21.1046 2 20V16Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
                                <path d="M14 16C14 14.8954 14.8954 14 16 14H20C21.1046 14 22 14.8954 22 16V20C22 21.1046 21.1046 22 20 22H16C14.8954 22 14 21.1046 14 20V16Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
                              </svg>
                            </motion.div>
                          ) : null}

                          {shouldDisplayMagnifyingGlassIcon() ? (
                            <motion.div>
                              <Search
                                size={24}
                                className={`${styles.lightboxjs_icon} ${iconColor ? '' : getIconStyle()
                                  }`}
                                style={iconColor ? { color: iconColor } : {}}
                                color={iconColor ? iconColor : undefined}
                                onClick={() => initMagnifyingGlass()}
                              />
                            </motion.div>
                          ) : null}

                          {shouldDisplaySlideshowIcon() ? (
                            <motion.div className={styles.slideshowPlayBtn}>
                              {isSlideshowPlaying ? (
                                      <svg onClick={() => {
                                        isSlideshowPlaying
                                            ? stopSlideshow()
                                            : playSlideshow()
                                      }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 7C4 5.89543 4.89543 5 6 5H8C9.10457 5 10 5.89543 10 7V17C10 18.1046 9.10457 19 8 19H6C4.89543 19 4 18.1046 4 17V7Z" stroke="white" stroke-width="1.5"/>
                                        <path d="M14 7C14 5.89543 14.8954 5 16 5H18C19.1046 5 20 5.89543 20 7V17C20 18.1046 19.1046 19 18 19H16C14.8954 19 14 18.1046 14 17V7Z" stroke="white" stroke-width="1.5"/>
                                      </svg>
                              ) : (
                                  <svg onClick={() => {
                                    isSlideshowPlaying
                                        ? stopSlideshow()
                                        : playSlideshow()
                                  }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.9611 13.7364L8.99228 18.2901C7.65896 19.052 6 18.0892 6 16.5536V7.44631C6 5.91067 7.65896 4.94793 8.99228 5.70983L16.9611 10.2635C18.3048 11.0313 18.3048 12.9687 16.9611 13.7364Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
                                  </svg>
                              )}
                            </motion.div>
                          ) : null}
                        </div>
                      )}
                      <motion.div className={styles.closeIcon}>
                        <svg onClick={() => {
                          closeModal()
                        }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M17.1985 18.1848C17.609 18.5953 18.2744 18.5953 18.6848 18.1848C19.0953 17.7744 19.0953 17.1089 18.6848 16.6985L13.4827 11.4964L18.6848 6.29423C19.0953 5.88379 19.0953 5.21833 18.6848 4.80789C18.2744 4.39745 17.6089 4.39745 17.1985 4.80789L11.9964 10.01L6.79418 4.80783C6.38374 4.39739 5.71828 4.39739 5.30784 4.80783C4.8974 5.21827 4.8974 5.88372 5.30784 6.29416L10.51 11.4964L5.30783 16.6986C4.89739 17.109 4.89739 17.7745 5.30783 18.1849C5.71827 18.5953 6.38372 18.5953 6.79416 18.1849L11.9964 12.9827L17.1985 18.1848Z" fill="#B42F2F"/>
                        </svg>
                      </motion.div>
                    </section>
                    {displayArrows() ?

                      <div>
                        <div
                          className={
                            rightArrowStyle
                              ? `${styles.next1} ${getArrowStyle()} imageModal`
                              : "imageModal"
                          }
                          style={rightArrowStyle}
                          onClick={() => {
                            nextSlide()
                          }}
                        >
                          {nextArrowElem ? nextArrowElem :
                            <span className={`${props.rightArrowClassname ? props.rightArrowClassname : ""}`}>&#10095;</span>
                          }
                        </div>
                        <div
                          className={
                            leftArrowStyle
                              ? `${styles.prev1} ${getArrowStyle()} imageModal`
                              : "imageModal"
                          }
                          style={leftArrowStyle}
                          onClick={() => {
                            prevSlide()
                          }}
                        >
                          {prevArrowElem ? prevArrowElem :
                            <span className={`${props.leftArrowClassname ? props.leftArrowClassname : ""}`}>&#10094;</span>
                          }
                        </div>
                      </div>
                      : null
                    }

                    <AnimatePresence initial={false} custom={direction}>
                      <ReactSwipe
                        className={`${showThumbnails
                            ? styles.slideshowInnerContainerThumbnails
                            : ''
                          } ${isImageCaption() ? styles.slideImageAndCaption : ''
                          } 
                    ${props.fullScreen
                            ? styles.slideshowInnerContainerFullScreen
                            : styles.slideshowInnerContainer
                          }  `}
                        swipeOptions={reactSwipeOptions}
                        ref={(el) => (reactSwipeEl = el)}
                        childCount={images.length}
                      >
                        {regularImgPaneNodes}
                      </ReactSwipe>

                      {displayLoader == true && !isHTMLVideo(slideIndex) ? (
                        <span
                          key='loader'
                          className={`${styles.loader
                            } ${getLoaderThemeClass()}`}
                        ></span>
                      ) : null}
                    </AnimatePresence>

                    <div
                      className={`${styles.thumbnailsOuterContainer} ${isImageCaption() ? styles.thumbnailsAndCaption : ''}`}
                      style={
                        isImageCaption()
                          ? {
                            backgroundColor: backgroundColor
                          }
                          : {}
                      }
                    >
                      {isImageCaption() && !zoomedIn ? (
                        <div className={`${styles.imgTitleContainer} imageModal`}>
                          <p
                            className={`${styles.imgTitle}`}
                            key={'imgCaption' + slideIndex}
                            style={
                              props.captionStyle
                                ? props.captionStyle
                                : { color: textColor }
                            }
                          >
                            {getImageCaption()}
                          </p>
                        </div>
                      ) : null}

                      <AnimatePresence initial={animatedThumbnails}>
                        {showThumbnails !== false && (
                          <motion.div
                            initial={'hidden'}
                            exit={'hidden'}
                            animate={'visible'}
                            style={
                              imagesLoaded ? {} : { display: 'displayHidden' }
                            }
                            transition={{
                              type: 'spring',
                              duration: 0.75
                            }}
                            variants={thumbnailVariants}
                            className={`${styles.thumbnails} ${isImageCaption()
                                ? styles.thumbnailsWithCaption
                                : ''
                              }`}
                          >
                            <ScrollContainer
                              className='scroll-container'
                              vertical={true}
                              horizontal={false}
                              hideScrollbars={false}
                            >
                              {frameworkID == 'next' &&

                                props.images
                                ? props.images.map((img, index) => (
                                  <img
                                    className={`${styles.thumbnail} imageModal`}
                                    src={getThumbnailImgSrcNext(img, index)}
                                    style={
                                      slideIndex === index
                                        ? { border: thumbnailBorder }
                                        : { border: inactiveThumbnailBorder }
                                    }
                                    key={index}
                                    onClick={() => {
                                      thumbnailClick(index);
                                    }}
                                    alt={img.alt}
                                    onLoad={() => setImagesLoaded(true)}
                                  />
                                ))
                                : // Not Next.js
                                images.map((img, index) => (
                                  <img
                                    src={getThumbnailImgSrc(img, index)}
                                    style={
                                      slideIndex === index
                                        ? { border: thumbnailBorder }
                                        : { border: inactiveThumbnailBorder }
                                    }
                                    className={`${styles.thumbnail} imageModal`}
                                    key={index}
                                    onClick={() => {
                                      thumbnailClick(index)
                                    }}
                                    alt={img.alt}
                                    onLoad={() => setImagesLoaded(true)}
                                  />
                                ))}
                            </ScrollContainer>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </Div100vh>
            </Portal>
          )}
        </AnimatePresence>
      </AnimateSharedLayout>
    </div>
  </div>
}
