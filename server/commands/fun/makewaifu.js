const Discord = require("discord.js");
const Nightmare = require("nightmare");
const realMouse = require("nightmare-real-mouse");
const Canvas = require("canvas");

realMouse(Nightmare);

exports.run = async (client, message, args) => {
    if (message.author.id === "157673412561469440" || message.author.id === "630573404352937996"){
    const nightmare = Nightmare({
        show: false,
        width: 1080,
        height: 1080
    });

    await nightmare
        .useragent(
            "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36"
        )
        .goto("https://waifulabs.com/")
        .wait("span.label")
        .evaluate(() => {
            let elements = document.querySelectorAll("span.label");
            Array.from(elements).forEach(element => {
                if (element.textContent.toLowerCase() === "meet your dream waifu") {
                    let event = document.createEvent("MouseEvent");
                    event.initEvent("click", true, true);
                    element.dispatchEvent(event);
                }
            });
        })
        .then(async () => {
            console.log("first then");
            await nightmare
                .wait(1500)
                .realClick("div.sc-dnqmqq")
                .wait("div.cards-container")
                .evaluate(getBounds, "div.cards-container")
                .then(async rects => {
                    console.log("second then");
                    console.log("rects", rects);

                    function getScreenshot(rect) {
                        nightmare
                            .screenshot({
                                x: rect.left,
                                y: rect.top,
                                width: rect.width,
                                height: rect.height
                            })
                            .then(async buffer => {
                                //----------------------------------------------------------------- select 1
                                let img = await drawGrid(buffer);
                                const attachment = new Discord.Attachment(img, "waifu.png");
                                message.channel
                                    .send(
                                        `please tell me what one you like the most ! like the row then column like **B3**`
                                    )
                                    .then(() => {
                                        message.channel.send(attachment).then(() => {
                                            message.channel
                                                .awaitMessages(
                                                    res => res.author.id === message.author.id, {
                                                    maxMatches: 1,
                                                    time: 120000,
                                                    errors: ["time"]
                                                }
                                                )
                                                .then(async collected => {
                                                    let choice = collected.first().content.trim().toLowerCase();
                                                    let obj = {
                                                        x: 75,
                                                        y: 75
                                                    };
                                                    if (choice.indexOf("b") > -1) {
                                                        obj.x += 150 + 25;
                                                    } else if (choice.indexOf("c") > -1) {
                                                        obj.x += (150 * 2) + (25 * 2);
                                                    } else if (choice.indexOf("d") > -1) {
                                                        obj.x += (150 * 3) + (25 * 3);
                                                    }
                                                    let yNum = Number(choice.substring(1, 2));
                                                    obj.y += yNum === 1 ? 0 : yNum < 5 ? (150 * (yNum - 1)) + (25 * (yNum - 1)) : 0;

                                                    console.log(obj)

                                                    await nightmare
                                                        .realClick("div.cards-container", obj)
                                                        .wait(2000)
                                                        .evaluate(getBounds, "div.cards-container")
                                                        .then(async rects => {
                                                            console.log("second then");
                                                            console.log("rects", rects);

                                                            function getScreenshot(rect) {
                                                                nightmare
                                                                    .screenshot({
                                                                        x: rect.left,
                                                                        y: rect.top,
                                                                        width: rect.width,
                                                                        height: rect.height
                                                                    })
                                                                    .then(async buffer => {
                                                                        //----------------------------------------------------------------- select colour palette
                                                                        let img = await drawGrid(buffer);
                                                                        const attachment = new Discord.Attachment(img, "waifu.png");
                                                                        message.channel
                                                                            .send(
                                                                                `please tell me what colour palette you like the most !`
                                                                            )
                                                                            .then(() => {
                                                                                message.channel.send(attachment).then(() => {
                                                                                    message.channel
                                                                                        .awaitMessages(
                                                                                            res => res.author.id === message.author.id, {
                                                                                            maxMatches: 1,
                                                                                            time: 120000,
                                                                                            errors: ["time"]
                                                                                        }
                                                                                        )
                                                                                        .then(async collected => {
                                                                                            let choice = collected.first().content.trim().toLowerCase();
                                                                                            let obj = {
                                                                                                x: 75,
                                                                                                y: 75
                                                                                            };
                                                                                            if (choice.indexOf("b") > -1) {
                                                                                                obj.x += 150 + 25;
                                                                                            } else if (choice.indexOf("c") > -1) {
                                                                                                obj.x += (150 * 2) + (25 * 2);
                                                                                            } else if (choice.indexOf("d") > -1) {
                                                                                                obj.x += (150 * 3) + (25 * 3);
                                                                                            }
                                                                                            let yNum = Number(choice.substring(1, 2));
                                                                                            obj.y += yNum === 1 ? 0 : yNum < 5 ? (150 * (yNum - 1)) + (25 * (yNum - 1)) : 0;

                                                                                            console.log(obj)



                                                                                            let cls = "div.cards-container";

                                                                                            if (collected.first().content.trim().toLowerCase() === "none") {
                                                                                                cls = "img.my-girl-image";
                                                                                                obj = {
                                                                                                    x: 10,
                                                                                                    y: 10
                                                                                                }
                                                                                            }

                                                                                            await nightmare
                                                                                                .realClick(cls, obj)
                                                                                                .wait(2000)
                                                                                                .evaluate(getBounds, "div.cards-container")
                                                                                                .then(async rects => {
                                                                                                    console.log("second then");
                                                                                                    console.log("rects", rects);

                                                                                                    function getScreenshot(rect) {
                                                                                                        nightmare
                                                                                                            .screenshot({
                                                                                                                x: rect.left,
                                                                                                                y: rect.top,
                                                                                                                width: rect.width,
                                                                                                                height: rect.height
                                                                                                            })
                                                                                                            .then(async buffer => {
                                                                                                                //----------------------------------------------------------------- select details
                                                                                                                let img = await drawGrid(buffer);
                                                                                                                const attachment = new Discord.Attachment(img, "waifu.png");
                                                                                                                message.channel
                                                                                                                    .send(
                                                                                                                        `what details look the best to you ??`
                                                                                                                    )
                                                                                                                    .then(() => {
                                                                                                                        message.channel.send(attachment).then(() => {
                                                                                                                            message.channel
                                                                                                                                .awaitMessages(
                                                                                                                                    res => res.author.id === message.author.id, {
                                                                                                                                    maxMatches: 1,
                                                                                                                                    time: 120000,
                                                                                                                                    errors: ["time"]
                                                                                                                                }
                                                                                                                                )
                                                                                                                                .then(async collected => {
                                                                                                                                    let choice = collected.first().content.trim().toLowerCase();
                                                                                                                                    let obj = {
                                                                                                                                        x: 75,
                                                                                                                                        y: 75
                                                                                                                                    };
                                                                                                                                    if (choice.indexOf("b") > -1) {
                                                                                                                                        obj.x += 150 + 25;
                                                                                                                                    } else if (choice.indexOf("c") > -1) {
                                                                                                                                        obj.x += (150 * 2) + (25 * 2);
                                                                                                                                    } else if (choice.indexOf("d") > -1) {
                                                                                                                                        obj.x += (150 * 3) + (25 * 3);
                                                                                                                                    }
                                                                                                                                    let yNum = Number(choice.substring(1, 2));
                                                                                                                                    obj.y += yNum === 1 ? 0 : yNum < 5 ? (150 * (yNum - 1)) + (25 * (yNum - 1)) : 0;

                                                                                                                                    console.log(obj)



                                                                                                                                    let cls = "div.cards-container";

                                                                                                                                    if (collected.first().content.trim().toLowerCase() === "none") {
                                                                                                                                        cls = "img.my-girl-image";
                                                                                                                                        obj = {
                                                                                                                                            x: 10,
                                                                                                                                            y: 10
                                                                                                                                        }
                                                                                                                                    }

                                                                                                                                    console.log(obj)

                                                                                                                                    await nightmare
                                                                                                                                        .realClick(cls, obj)
                                                                                                                                        .wait(2000)
                                                                                                                                        .evaluate(getBounds, "div.cards-container")
                                                                                                                                        .then(async rects => {
                                                                                                                                            console.log("second then");
                                                                                                                                            console.log("rects", rects);

                                                                                                                                            function getScreenshot(rect) {
                                                                                                                                                nightmare
                                                                                                                                                    .screenshot({
                                                                                                                                                        x: rect.left,
                                                                                                                                                        y: rect.top,
                                                                                                                                                        width: rect.width,
                                                                                                                                                        height: rect.height
                                                                                                                                                    })
                                                                                                                                                    .then(async buffer => {
                                                                                                                                                        //----------------------------------------------------------------- select pose
                                                                                                                                                        let img = await drawGrid(buffer);
                                                                                                                                                        const attachment = new Discord.Attachment(img, "waifu.png");
                                                                                                                                                        message.channel
                                                                                                                                                            .send(
                                                                                                                                                                `what pose do you like the most ??`
                                                                                                                                                            )
                                                                                                                                                            .then(() => {
                                                                                                                                                                message.channel.send(attachment).then(() => {
                                                                                                                                                                    message.channel
                                                                                                                                                                        .awaitMessages(
                                                                                                                                                                            res => res.author.id === message.author.id, {
                                                                                                                                                                            maxMatches: 1,
                                                                                                                                                                            time: 120000,
                                                                                                                                                                            errors: ["time"]
                                                                                                                                                                        }
                                                                                                                                                                        )
                                                                                                                                                                        .then(async collected => {
                                                                                                                                                                            let choice = collected.first().content.trim().toLowerCase();
                                                                                                                                                                            let obj = {
                                                                                                                                                                                x: 75,
                                                                                                                                                                                y: 75
                                                                                                                                                                            };
                                                                                                                                                                            if (choice.indexOf("b") > -1) {
                                                                                                                                                                                obj.x += 150 + 25;
                                                                                                                                                                            } else if (choice.indexOf("c") > -1) {
                                                                                                                                                                                obj.x += (150 * 2) + (25 * 2);
                                                                                                                                                                            } else if (choice.indexOf("d") > -1) {
                                                                                                                                                                                obj.x += (150 * 3) + (25 * 3);
                                                                                                                                                                            }
                                                                                                                                                                            let yNum = Number(choice.substring(1, 2));
                                                                                                                                                                            obj.y += yNum === 1 ? 0 : yNum < 5 ? (150 * (yNum - 1)) + (25 * (yNum - 1)) : 0;

                                                                                                                                                                            console.log(obj)



                                                                                                                                                                            let cls = "div.cards-container";

                                                                                                                                                                            if (collected.first().content.trim().toLowerCase() === "none") {
                                                                                                                                                                                cls = "img.my-girl-image";
                                                                                                                                                                                obj = { x: 10, y: 10 }
                                                                                                                                                                            }
                                                                                                                                                                            console.log(obj)

                                                                                                                                                                            await nightmare
                                                                                                                                                                                .realClick(cls, obj)
                                                                                                                                                                                .wait(2000)
                                                                                                                                                                                .evaluate(getBounds, "div.cards-container")
                                                                                                                                                                        });
                                                                                                                                                                });
                                                                                                                                                            });
                                                                                                                                                    })
                                                                                                                                                    .catch(function (err) {
                                                                                                                                                        console.log(err);
                                                                                                                                                    });
                                                                                                                                            }
                                                                                                                                            setTimeout(() => {
                                                                                                                                                getScreenshot(rects);
                                                                                                                                            }, 2000);
                                                                                                                                        });


                                                                                                                                });
                                                                                                                        });
                                                                                                                    });
                                                                                                            })
                                                                                                            .catch(function (err) {
                                                                                                                console.log(err);
                                                                                                            });
                                                                                                    }
                                                                                                    getScreenshot(rects);
                                                                                                });
                                                                                        });
                                                                                });
                                                                            });
                                                                    })
                                                                    .catch(function (err) {
                                                                        console.log(err);
                                                                    });
                                                            }
                                                            getScreenshot(rects);
                                                        });


                                                });
                                        });
                                    });
                            })
                            .catch(function (err) {
                                console.log(err);
                            });
                    }
                    getScreenshot(rects);
                });
        })
        .catch(function (err) {
            console.log(err);
        });

    async function getBounds(selector) {
        let obj = {
            top: document.querySelector(selector).offsetTop,
            left: document.querySelector(selector).offsetLeft,
            width: document.querySelector(selector).offsetWidth,
            height: document.querySelector(selector).offsetHeight
        };
        return obj;
    }

    async function drawGrid(buffer) {
        const canvas = Canvas.createCanvas(675, 675);

        const ctx = canvas.getContext("2d");

        const background = await Canvas.loadImage(buffer);
        await ctx.drawImage(background, 0, 0, 675, 675);

        ctx.font = "28px Arial";
        ctx.fillText("A1", 0, 28);
        ctx.fillText("B", 175, 28);
        ctx.fillText("C", 350, 28);
        ctx.fillText("D", 525, 28);

        ctx.fillText("2", 0, 203);
        ctx.fillText("3", 0, 378);
        ctx.fillText("4", 0, 553);
        return canvas.toBuffer();
    }
}
};