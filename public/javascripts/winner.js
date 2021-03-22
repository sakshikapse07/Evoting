if (typeof registerPaint !== undefined) {
    class Confetti {
        static get inputProperties() {
            return ["--pieces", "--colors"];
        }

        paint(ctx, geom, properties) {
            const pieces = properties.get("--pieces");
            const padding = 10;
            const colors = properties
                .get("--colors")
                .toString()
                .trim()
                .split(" ");

            const shapes = ["circle", "square"];

            for (let i = 0; i < pieces; i++) {
                const sz = this.getRandomNum(2, 30);
                const shape = shapes[this.getRandomNum(0, shapes.length)];
                const color = colors[this.getRandomNum(0, colors.length)];
                const { x, y } = this.getRandomCoords(sz, geom, padding);

                if (shape === "circle") {
                    this.circle(x, y, sz, color, ctx);
                } else {
                    this.square(x, y, sz, color, ctx);
                }
            }
        }

        getRandomCoords(sz, geom, padding) {
            const { width, height } = geom;
            const maxX = width - padding - sz;
            const maxY = height - padding - sz;

            return {
                x: this.getRandomNum(padding, maxX),
                y: this.getRandomNum(padding, maxY)
            };
        }

        getRandomNum(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        square(x, y, sz, color, ctx) {
            const deg = this.getRandomNum(10, 345);
            // save current position so we can reset once we're done
            ctx.save();
            // translate to new coords
            ctx.translate(x, y);
            ctx.rotate(deg * Math.PI / 180);

            ctx.fillStyle = color;
            ctx.fillRect(0, 0, sz, sz);
            // reset coords for the next draw
            ctx.restore();
        }

        circle(x, y, sz, color, ctx) {
            ctx.beginPath();
            ctx.arc(x, y, sz / 2, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }
    }

    registerPaint("confetti", Confetti);
}