import type { Directive } from 'vue'
interface DragScrollHTMLElement extends HTMLElement {
  _dragscroll?: {
    isDown: boolean
    startX: number
    scrollLeft: number
    handleMouseDown: (e: MouseEvent) => void
    handleMouseLeave: () => void
    handleMouseUp: () => void
    handleMouseMove: (e: MouseEvent) => void
  }
}

export const vDragscroll: Directive<DragScrollHTMLElement> = {
  mounted(el) {
    let isDown = false
    let startX: number
    let scrollLeft: number

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true
      startX = e.pageX - el.offsetLeft
      scrollLeft = el.scrollLeft
      el.style.cursor = 'grabbing'
    }

    const handleMouseLeave = () => {
      isDown = false
      el.style.cursor = 'grab'
    }

    const handleMouseUp = () => {
      isDown = false
      el.style.cursor = 'grab'
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - el.offsetLeft
      const walk = (x - startX) * 2
      el.scrollLeft = scrollLeft - walk
    }

    el.addEventListener('mousedown', handleMouseDown)
    el.addEventListener('mouseleave', handleMouseLeave)
    el.addEventListener('mouseup', handleMouseUp)
    el.addEventListener('mousemove', handleMouseMove)

    // 保存引用以便卸载时使用
    el._dragscroll = {
      isDown,
      startX: 0,
      scrollLeft: 0,
      handleMouseDown,
      handleMouseLeave,
      handleMouseUp,
      handleMouseMove,
    }
  },
  unmounted(el) {
    // 清理事件监听
    const handlers = el._dragscroll
    if (handlers) {
      el.removeEventListener('mousedown', handlers.handleMouseDown)
      el.removeEventListener('mouseleave', handlers.handleMouseLeave)
      el.removeEventListener('mouseup', handlers.handleMouseUp)
      el.removeEventListener('mousemove', handlers.handleMouseMove)
    }
  },
}
