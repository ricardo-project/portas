const pi = Math.PI

/* VARIÁVEIS IMPORTANTES */
let svg = $(".list svg"),
polyg = $("polygon"),
main = $("main"),
P = new Array([], [], [], [], [], [], []),
//hSVG = [],
TXT = ["1", "‒"],
spc = $(".space"),
SVG = spc.find("svg"),
Items = $(".items"),
M = $(".message"),
itemsSlct = [],
allI = new Array(
    [], //---> Portas
    [], //---> Origem
    [] //---> Destino
), /*addORXOR = function(i, t) {
    const ang = i*pi/180, x = -62 + 79.6*Math.cos(ang), y = 50 - 79.6*Math.sin(ang)
    hSVG[1] += t + x + "," + y
    hSVG[2] += t + (x + 20) + "," + y
},*/ ball = (x, y) => {
    let b = []
    for(let i = 180; i >= -180; i -= 10) {
        const ang = i*pi/180
        const X = x + 7*Math.cos(ang), Y = y + 7*Math.sin(ang)
        b.push([X, Y])
    } return b
    //return "<circle fill='url(#G)' cx=" + x + " cy=" + y + " r=7></circle>"
}, changeP = (S, dX, dY) => {
    const V = new Array(dX, dY)
    S.css("left", V[0])
    S.css("top", V[1])
    return V
}, functMove = (event, W, H, html, bC, cond, n) => {
    if(event.which == 1) {
        let newI = $(html[0] + " style='opacity: 0.5; position: absolute; z-index: 2'>" + html[1]),
        posit = changeP(newI, event.clientX - W/2, event.clientY - H/2)
        newI.prependTo($(document.body))
        $(window).on("mousemove.functW", (e) => posit = changeP(newI, e.clientX - W/2, e.clientY - H/2));
        $(window).on("mouseup.functW", function() {
            $(window).off(".functW")
            if(posit[0] > 250 - W*3/4) {
                newI.detach()
                newI.prependTo(spc)
                let newL = posit[0] - 250 + spc.scrollLeft()
                let newT = posit[1] + spc.scrollTop()
                if(newL < 20) {
                    newL = 20
                } if(newT < 20) {
                    newT = 20
                } newI.css("left", newL)
                newI.css("top", newT)
                newI.css("opacity", "")
                let Item
                if(cond) {
                    Item = newI.children()
                    $(newI).css("z-index", "")
                } else {
                    Item = newI
                } let qtd = allI[n].length
                allI[n].push(newI)
                Item.on("mousedown", function(Event) {
                    let Posit,
                    functPX = () => {},
                    functPY = () => {}
                    const ctrl = Event.ctrlKey,
                    CX = Event.clientX,
                    CY = Event.clientY,
                    pX = parseFloat(newI.css("left")),
                    pY = parseFloat(newI.css("top")),
                    sX = spc.scrollLeft(),
                    sY = spc.scrollTop()
                    if(sX > 0) {
                        functPX = (dX) => {
                            if(dX < 0) {
                                newI.css("padding-right", -dX + "px")
                            } else {
                                newI.css("padding-right", "")
                            }
                        }
                    } if(sY > 0) {
                        functPY = (dY) => {
                            if(dY < 0) {
                                newI.css("padding-bottom", -dY + "px")
                            } else {
                                newI.css("padding-bottom", "")
                            }
                        }
                    } $(window).on("mousemove.functW", (EVENT) => {
                        const dX = EVENT.clientX - CX,
                        dY = EVENT.clientY - CY
                        functPX(dX)
                        functPY(dY)
                        Posit = changeP(newI, pX + dX, pY + dY)
                    });
                    $(window).on("mouseup.functW", function() {
                        $(window).off(".functW")
                        newI.css("padding-bottom", "")
                        newI.css("padding-right", "")
                        if(Posit) {
                            let PX = Posit[0] + sX
                            let PY = Posit[1] + sY
                            if(PX < 20) {
                                PX = 20
                            } if(PY < 20) {
                                PY = 20
                            } newI.css("left", PX)
                            newI.css("top", PY)
                        }
                    })
                    if(Event.which == 1 && ctrl) {
                        const alt = Event.altKey
                        if(alt && n !== 1) { //---> Selecionar o final (NÃO pode ser origem)
                            if(n == 0) {
                                let found = false
                                $.each(itemsSlct, (I, E) => {
                                    if(E[0] == 0 && E[1] == qtd) {
                                        functShowM("A porta já foi selecionada como início da conexão. Favor, selecione outra porta ou um destino.")
                                        found = true
                                        return false
                                    }
                                }); if(found) return;
                            }
                            $.each(itemsSlct, (I, E) => {
                                allI[E[0]][E[1]].css("filter", "")
                            }); itemsSlct = new Array()
                        } else if(!alt && n !== 2) { //---> Selecionar o início (NÃO pode ser destino)
                            let condNotSlct = true
                            $.each(itemsSlct, (ind, elem) => {
                                if(elem[0] == n && elem[1] == qtd) {
                                    newI.css("filter", "")
                                    itemsSlct.splice(ind, 1)
                                    condNotSlct = false
                                    return false
                                }
                            }); if(condNotSlct) {
                                newI.css("filter", bC + " drop-shadow(rgb(0,0,0,0.3) 2px 2px 0px)")
                                itemsSlct.push([n, qtd])
                            }
                        }
                    } /*else if(Event.which == 3) {
                        newI.remove()
                    }*/
                })
            } else {
                newI.remove()
            }
        })
    }
}, functShowM = (txt) => {
    clearTimeout(setM)
    M.html(txt)
    M.attr("style", "")
    setM = setTimeout(functDisappM, 3000)
}, functDisappM = () => {
    M.css("opacity", 0)
    setM = setTimeout(function() {
        M.css("left", "-100%")
    }, 300)
}, condM = [
    false, //---> Ctrl + Clique
    false, //---> Ctrl + Alt + Clique (b. esquerdo)
    false //---> Shift + Clique (b. esquerdo): Mude a carga da origem
], setM

/*$(window).on("keydown", event => {
    const alt = event.altKey,
    ctrl = event.ctrlKey,
    shift = event.shiftKey
    if(ctrl && !shift) {
        if(alt && !condM[1]) {
            condM[1] = true
            functShowM("<b>Ctrl + Alt + Clique (b. esquerdo)</b>: Selecione uma porta ou destino como fim da conexão")
        } else if(!alt && !condM[0]) {
            condM[0] = true
            functShowM("<b>Ctrl + Clique (b. esquerdo)</b>: Selecione portas e origens como início da conexão ou <b>Ctrl + Clique (b. direito)</b>: Exclua um item")
        }
    } else if(!ctrl && !alt && shift && !condM[2]) {
        condM[2] = true
        functShowM("<b>Shift + Clique (b. esquerdo)</b>: Mude a carga da origem")
    }
})*/

// Porta AND e NAND
P[0] = P[0].concat([ [0,0], [0,100] ])
for(let i = -90; i <= 90; i++) {
    const ang = i*pi/180
    P[0].push([50 + 50*Math.cos(ang), 50 - 50*Math.sin(ang)])
} P[3] = P[0].slice(0, 92).concat(ball(107, 50), P[0].slice(94, P[0].length))

// Porta OR e XOR
for(let i = 38; i >= -38; i--) {
    const ang = i*pi/180,
    x = -62 + 79.6*Math.cos(ang),
    y = 50 - 79.6*Math.sin(ang)
    P[1].push([x, y])
    P[2].push([x + 20, y])
}
let Y = []
const a = 1/(Math.pow(8, 2.4) - 1)
for(let i = 0; i <= 120; i++) {
    const x = (i - 120)/50
    Y.push((1 + a)*Math.pow(8, x) - a)
}
Y.forEach((E, I) => {
    const x = I, y = 100 - 50*E
    P[1].push([x, y])
    P[2].push([x + 20, y])
});
for(let I = 120 - 1; I >= 0; I--) {
    const y = 50*Y[I]
    P[1].push([I, y])
    P[2].push([I + 20, y])
}

// Porta XOR
for(let i = 44; i >= -44; i--) {
    const ang = i*pi/180,
    x = -42 + 73*Math.cos(ang),
    y = 50 - 73*Math.sin(ang)
    P[2].push([x, y])
}
for(let i = -50; i <= 50; i++) {
    const ang = i*pi/180,
    x = -42 + 66*Math.cos(ang),
    y = 50 - 66*Math.sin(ang)
    P[2].push([x, y])
} P[2].push(P[2][318])
P[2].push(P[2][317])

// Porta NOR, XNOR e NOT
P[4] = P[1].slice(0, 197).concat(ball(127, 50), P[1].slice(199, P[1].length))
P[5] = P[2].slice(0, 197).concat(ball(147, 50), P[2].slice(199, P[2].length))
P[6] = new Array([0, 70]).concat(ball(97, 35), new Array([0, 0]))

/* FUNÇÕES DE MOVIMENTO PARA OS ITENS DO MENU */

$.each(svg, (I, E) => {
    const e = $(E), W = e.width(), H = e.height()
    $.each(P[I], (i, elem) => {
        const newp = svg[0].createSVGPoint()
        newp.x = elem[0]
        newp.y = elem[1]
        polyg[I].points.appendItem(newp)
    })
    /* Inserir pontos */
    e.find("use").on("mousedown", (event) => functMove(event, W, H, ["<svg width=" + W + " height=" + H, "<use href=#p" + I + "></use></svg>"], "brightness(0.75) contrast(1.3)", true, 0))
})

$.each(Items, (I, E) => {
    const e = $(E)
    e.on("mousedown", (event) => functMove(event, e.width(), e.height(), ["<div class='" + e.attr("class") + "'", TXT[I] + "</div>"], "brightness(0.6) contrast(1.6)", false, I + 1))
})