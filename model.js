export default class Model {
    constructor() {
        this.colors = [
            [255, 255, 0],
            [0, 185, 63],
            [0, 104, 255],
            [122, 0, 229]
          ];
        this.defaultColor = [255, 255, 0]
    }
    reset() {}
    setup(canvas, amount, calculations) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.calculations = calculations;
        this.sandpiles = [...Array(this.width)].map(_ => Array(this.height).fill(0));
        this.nextpiles = [...Array(this.width)].map(_ => Array(this.height).fill(0));

        this.sandpiles[this.width/2][this.height/2] = amount;
        //console.log("setup sandpiles", this.sandpiles);

        this.minX = Math.floor(this.width / 2);
        this.maxX = Math.ceil(this.width / 2);
        this.minY = Math.floor(this.height / 2);
        this.maxY = Math.ceil(this.height / 2);

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = `rgb(${this.defaultColor[0]}, ${this.defaultColor[1]}, ${this.defaultColor[2]})`;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    async topple() {
        this.nextpiles = [...Array(this.width)].map(_ => Array(this.height).fill(0));
        this.minX = Math.max(0, this.minX - 1);
        this.maxX = Math.min(this.width-1, this.maxX + 1);
        this.minY = Math.max(0, this.minY - 1);
        this.maxY = Math.min(this.height-1, this.maxY + 1);
        for (let x = this.minX; x <= this.maxX; x++) {
            for (let y = this.minY; y <= this.maxY; y++) {
                if (this.sandpiles[x][y] > 3) {
                  this.nextpiles[x][y] += this.sandpiles[x][y] - 4;
                  if (x + 1 < this.width)
                    this.nextpiles[x + 1][y]++;
                  if (x - 1 >= 0)
                    this.nextpiles[x - 1][y]++;
                  if (y + 1 < this.height)
                    this.nextpiles[x][y + 1]++;
                  if (y - 1 >= 0)
                    this.nextpiles[x][y - 1]++;
                } else {
                    this.nextpiles[x][y] += this.sandpiles[x][y];
                }
            }
        }
        this.sandpiles = this.nextpiles;
    }

    async render() {
        const ctx = this.canvas.getContext("2d");
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.sandpiles[x][y] > 0) {
                    let color = this.defaultColor;
                    if (this.sandpiles[x][y] <= 4) {
                        color = this.colors[this.sandpiles[x][y] - 1];
                    }
                    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }

    async draw() {
        await this.render();
        for (let i = 0; i < this.calculations; i++) {
            await this.topple();
        }
    }
}