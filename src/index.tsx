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
import { TransformWrapper, TransformComponent,  ReactZoomPanPinchRef, } from 'react-zoom-pan-pinch'
import ReactSwipe from 'react-swipe'
import { saveAs } from 'file-saver'
import Div100vh from 'react-div-100vh'
import KeyHandler from 'react-key-handler'
import {Slideshow} from "./Slideshow"
import {AnimImage} from "./AnimImage"
import { useIsomorphicLayoutEffect } from 'usehooks-ts'
import { useInterval } from 'usehooks-ts'

export const initReviewersImageView = () => {};


export { Slideshow, AnimImage as Image }