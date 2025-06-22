"use client"

import { useEffect, useRef, useState } from "react"

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gridStyle, setGridStyle] = useState<"neural" | "hexagon" | "circuit" | "wave">("neural")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawNeuralGrid = () => {
      const gridSize = 80
      const nodes: { x: number; y: number; connections: number[] }[] = []

      // Create nodes
      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          const offsetX = Math.sin(time + y * 0.01) * 20
          const offsetY = Math.cos(time + x * 0.01) * 20
          nodes.push({
            x: x + offsetX,
            y: y + offsetY,
            connections: [],
          })
        }
      }

      // Draw connections
      ctx.lineWidth = 1
      nodes.forEach((node, index) => {
        const nearbyNodes = nodes.filter((other, otherIndex) => {
          if (otherIndex === index) return false
          const distance = Math.sqrt((node.x - other.x) ** 2 + (node.y - other.y) ** 2)
          return distance < gridSize * 1.5
        })

        nearbyNodes.forEach((other) => {
          const opacity = 0.1 + Math.sin(time + node.x * 0.01 + node.y * 0.01) * 0.05
          const hue = (time * 50 + node.x * 0.5 + node.y * 0.5) % 360
          ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${opacity})`

          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(other.x, other.y)
          ctx.stroke()
        })

        // Draw node
        const nodeOpacity = 0.3 + Math.sin(time + node.x * 0.02 + node.y * 0.02) * 0.2
        const nodeHue = (time * 30 + node.x * 0.3 + node.y * 0.3) % 360
        ctx.fillStyle = `hsla(${nodeHue}, 80%, 70%, ${nodeOpacity})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, 3 + Math.sin(time + node.x * 0.01) * 2, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const drawHexagonGrid = () => {
      const hexSize = 60
      const hexHeight = hexSize * Math.sqrt(3)

      for (let row = 0; row < canvas.height / hexHeight + 2; row++) {
        for (let col = 0; col < canvas.width / (hexSize * 1.5) + 2; col++) {
          const x = col * hexSize * 1.5
          const y = row * hexHeight + ((col % 2) * hexHeight) / 2

          const hue = (time * 20 + col * 30 + row * 30) % 360
          const opacity = 0.15 + Math.sin(time + col * 0.2 + row * 0.2) * 0.1
          ctx.strokeStyle = `hsla(${hue}, 60%, 50%, ${opacity})`
          ctx.lineWidth = 1.5

          drawHexagon(ctx, x, y, hexSize + Math.sin(time + col + row) * 5)
        }
      }
    }

    const drawCircuitGrid = () => {
      const gridSize = 100
      ctx.lineWidth = 2

      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          const hue = (time * 40 + x * 0.5 + y * 0.5) % 360
          const opacity = 0.2 + Math.sin(time + x * 0.01 + y * 0.01) * 0.15

          // Circuit paths
          if (Math.sin(time + x * 0.01) > 0.3) {
            ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + gridSize, y)
            ctx.stroke()
          }

          if (Math.cos(time + y * 0.01) > 0.3) {
            ctx.strokeStyle = `hsla(${(hue + 60) % 360}, 80%, 60%, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x, y + gridSize)
            ctx.stroke()
          }

          // Circuit nodes
          const nodeSize = 4 + Math.sin(time + x * 0.01 + y * 0.01) * 3
          ctx.fillStyle = `hsla(${(hue + 120) % 360}, 90%, 70%, ${opacity * 2})`
          ctx.beginPath()
          ctx.arc(x, y, nodeSize, 0, Math.PI * 2)
          ctx.fill()

          // Glowing effect
          ctx.shadowColor = `hsla(${hue}, 90%, 70%, 0.5)`
          ctx.shadowBlur = 10
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }
    }

    const drawWaveGrid = () => {
      const gridSize = 40
      ctx.lineWidth = 1.5

      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          const waveX = Math.sin(time + y * 0.02) * 30
          const waveY = Math.cos(time + x * 0.02) * 30

          const hue = (time * 60 + x * 0.8 + y * 0.8) % 360
          const opacity = 0.12 + Math.sin(time + x * 0.015 + y * 0.015) * 0.08

          ctx.strokeStyle = `hsla(${hue}, 70%, 55%, ${opacity})`

          // Flowing wave lines
          ctx.beginPath()
          ctx.moveTo(x + waveX, y + waveY)
          ctx.quadraticCurveTo(
            x + gridSize / 2 + Math.sin(time + x * 0.03) * 20,
            y + gridSize / 2 + Math.cos(time + y * 0.03) * 20,
            x + gridSize + waveX,
            y + waveY,
          )
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(x + waveX, y + waveY)
          ctx.quadraticCurveTo(
            x + gridSize / 2 + Math.cos(time + x * 0.03) * 20,
            y + gridSize / 2 + Math.sin(time + y * 0.03) * 20,
            x + waveX,
            y + gridSize + waveY,
          )
          ctx.stroke()

          // Wave intersection points
          if (Math.random() > 0.95) {
            ctx.fillStyle = `hsla(${(hue + 180) % 360}, 80%, 70%, ${opacity * 3})`
            ctx.beginPath()
            ctx.arc(x + waveX, y + waveY, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }

    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3
        const hexX = x + size * Math.cos(angle)
        const hexY = y + size * Math.sin(angle)
        if (i === 0) {
          ctx.moveTo(hexX, hexY)
        } else {
          ctx.lineTo(hexX, hexY)
        }
      }
      ctx.closePath()
      ctx.stroke()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01

      // Draw the selected grid style
      switch (gridStyle) {
        case "neural":
          drawNeuralGrid()
          break
        case "hexagon":
          drawHexagonGrid()
          break
        case "circuit":
          drawCircuitGrid()
          break
        case "wave":
          drawWaveGrid()
          break
      }

      animationId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    animate()

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [gridStyle])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 50%, rgba(0, 0, 0, 1) 100%)",
        }}
      />

      {/* Grid Style Selector */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        <div className="text-white/70 text-xs font-medium mb-2 uppercase tracking-wide">Grid Style</div>
        {(["neural", "hexagon", "circuit", "wave"] as const).map((style) => (
          <button
            key={style}
            onClick={() => setGridStyle(style)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 backdrop-blur-sm ${
              gridStyle === style
                ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 border border-purple-400/50 shadow-lg"
                : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/80"
            }`}
          >
            {style.charAt(0).toUpperCase() + style.slice(1)}
          </button>
        ))}
      </div>
    </>
  )
}
