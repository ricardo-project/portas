const pi = Math.PI

/* VARIÁVEIS IMPORTANTES */
let pdiv = $(".list .pdiv"),
main = $("main"),
html = $("html")[0],
style = $("style"),
namep = new Array("and", "or", "xor", "nand", "nor", "xnor", "not"),
TXT = ["1", "-"],//‒"],
spc = $(".space"),
btn = $("input"),
SVG = spc.find("svg"),
Items = $(".items"),
M = $(".message"),
P = new Array([], [], [], [], [], [], []),
itemsSlct = [],
allI = new Array(
    [], //---> Portas
    [], //---> Origem
    [], //---> Destino
    [] //---> Linhas entre portas/origens e portas/destinos
), /*objItem = new Array(
    (item) => {
        return { //---> Portas
            elem: item,
            E: [],
            S: null,
            funct: []
        }
    }, (item) => { //---> Origem
        return {
            elem: item,
            S: null,
            funct: null
        }
    }, (item) => { //---> Destino
        return {
            elem: item,
            E: null,
            funct: null
        }
    }, (item) => { //---> Linhas entre portas/origens e portas/destinos
        return {
            elem: item,
            E: null,
            S: null
        }
    }
),*/ ball = (x, y) => {
    let b = []
    for(let i = 180; i >= -180; i -= 10) {
        const ang = i*pi/180
        const X = x + 7*Math.cos(ang), Y = y + 7*Math.sin(ang)
        b.push([X, Y])
    } return b
}, changeP = (S, dX, dY) => {
    const V = new Array(dX, dY)
    S.css("left", V[0])
    S.css("top", V[1])
    return V
}, newLine = (listP) => {
    let line = listP[0][0] + "," + listP[0][1]
    for(let i = 1; i < listP.length; i++) {
        const actp = listP[i]
        line += " " + actp[0] + "," + actp[1]
    } return line
}, createConex = function(values1, values2, q) {
    const { x1, y1, w1, h1 } = values1,
          { x2, y2, w2, h2 } = values2
    let xn = x1 + w1 - 10,
        yn = y1 + h1/2,
        Yn = y2 + h2*q
    let line = newLine(new Array(
        [xn, yn],
        [xn + 30, yn],
        [xn + 30, Yn],
        [x2 + 30, Yn]
    ))
    const newL = $(document.createElementNS('http://www.w3.org/2000/svg', 'polyline'));
    newL.attr('points', line);
    newL.appendTo(SVG)
    return newL
}, changeConexFunct = function(elem1, elem2, line) {
    console.log(elem1, elem2, line)
}, functMove = (event, e, content, bC, n) => {
    const W = e.width(),
    H = e.height()
    if(event.which == 1) {
        let newI = $("<div class='" + e.attr("class") + "' style='opacity: 0.5; position: absolute; z-index: 2'>" + content + "</div>"),
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
                let qtd = allI[n].length
                let objItem = {
                    elem: newI
                }; if(!n) {
                    Object.assign(objItem, {
                        funct: [],
                        E: []
                    })
                } allI[n].push(objItem)
                //allI[n].push(objItem[n](newI))
                newI.on("mousedown", function(Event) {
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
                            const T = parseFloat(newI.css("top")),
                            L = parseFloat(newI.css("left")),
                            fract = 1/(itemsSlct.length + 1)
                            $.each(itemsSlct, (I, E) => {
                                const elem = allI[E[0]][E[1]].elem,
                                t = parseFloat(elem.css("top")),
                                l = parseFloat(elem.css("left")),
                                w = elem.width(),
                                h = elem.height()
                                elem.css("filter", "")
                                let polyLine = createConex({ x1: l, y1: t, w1: w, h1: h }, { x2: L, y2: T, w2: W, h2: H }, (I + 1)*fract)
                                changeConexFunct(elem, newI, polyLine)
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
                    }
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
], setM,
newStyle = ":root {"

$(window).on("keydown", event => {
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
})

/* CRIANDO O FORMATO DAS PORTAS */

// Porta AND e NAND
P[0] = new Array([0, 0], [0, 100])
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

$.each(pdiv, (I, E) => {
    const e = $(E),
    actp = P[I],
    Name = namep[I]
    newStyle += "--" + Name + ":" + actp[0][0] + "px " + actp[0][1] + "px"
    for(let i = 1; i < actp.length; i++) {
        newStyle += ", " + actp[i][0] + "px " + actp[i][1] + "px"
    } newStyle += ";"
    /* Inserir pontos */
    e.on("mousedown", (event) => functMove(event, e, "<p>" + Name.toUpperCase() + "</p>", "brightness(0.75) contrast(1.3)", 0))
}); style.html(newStyle)

$.each(Items, (I, E) => {
    const e = $(E)
    e.on("mousedown", (event) => functMove(event, e, TXT[I], "brightness(0.6) contrast(1.6)", I + 1))
})

/* BOTÃO NA ENTRADA */
btn.on("click", function() {
    $(".introd").css("opacity", 0)
    setTimeout(function() {
        $(".introd").remove()
    }, 300)
})