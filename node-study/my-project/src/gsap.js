import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(ScrollTrigger, Observer);

function initGsap() {
    initProduct();
    // initProductWithObserver();
    initCarousel();
}

window.addEventListener("load", () => {
    initGsap();
    ScrollTrigger.refresh();
});

window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});

/**
 * 产品动画
 */
function initProduct() {

    // https://gsap.com/community/forums/topic/43112-stack-cards-on-top-of-each-other-with-scroll-trigger/
    // https://gsap.com/community/forums/topic/44674-stacked-cards-animation/
    const cardsWrappers = gsap.utils.toArray("#products .hero");
    const cards = gsap.utils.toArray("#products .hero .hero-content");

    const gap = 20
    const navbarHeight = document.querySelector('.navbar').clientHeight
    const h2Height = document.querySelector('#products h2').clientHeight
    const endTip = navbarHeight + h2Height + cardsWrappers[0].clientHeight + gap * (cardsWrappers.length + 1)

    cardsWrappers.forEach((wrapper, i) => {
        const card = cards[i];
        let scale = 1,
            rotation = 0;
        if (i !== cards.length - 1) {
            scale = 0.9 + 0.025 * i;
            rotation = -10;
        }
        gsap.to(card, {
            scale: scale,
            rotationX: rotation,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
                trigger: wrapper,
                start: "top " + (navbarHeight + h2Height + gap * i + gap * 2),
                end: "bottom " + endTip,
                endTrigger: "#products",
                scrub: true,
                pin: wrapper,
                pinSpacing: false,
                invalidateOnRefresh: true,
                // markers: {
                //     indent: 100 * i,
                //     startColor: "#0ae448",
                //     endColor: "#fec5fb",
                //     fontSize: "14px"
                // },
                id: i + 1
            }
        });
    });

    gsap.to('#products h2', {
        scrollTrigger: {
            trigger: '#products h2',
            endTrigger: "#products",
            // markers: true,
            pin: true,
            pinSpacing: false,
            start: "top " + (navbarHeight + gap),
            end: "bottom " + endTip,
        }
    })
}

/**
 * 合作企业走马灯
 */
function initCarousel() {
    const carousel = document.querySelector('#autoCarousel')
    const items = gsap.utils.toArray('#autoCarousel .carousel-item');

    items.forEach(item => {
        const clone = item.cloneNode(true)
        carousel.appendChild(clone);
    })

    const totalWidth = items.length * (items[1].getBoundingClientRect().x - items[0].getBoundingClientRect().x)
    gsap.to(document.querySelectorAll('#autoCarousel .carousel-item'), {
        scrollTrigger: {
            trigger: '#autoCarousel',
            // markers: true
        },
        x: `-=${totalWidth}`,
        duration: 15,
        ease: "none",
        repeat: -1,
        modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % totalWidth) // Wrap position
        },
    });
}

/**
 * 结合obersver，ppt效果
 */
function initProductWithObserver() {
    // 修改dom结构和css属性
    const products = document.querySelector('#products')
    const heros = products.querySelectorAll('.hero')
    const gridWrapper = document.createElement("div");
    gridWrapper.classList.add("hero-wrapper");
    heros.forEach(el => {
        gridWrapper.appendChild(el.cloneNode(true))
        el.remove()

    })
    products.appendChild(gridWrapper)

    // constants
    let allowScroll = true; // sometimes we want to ignore scroll-related stuff, like when an Observer-based section is transitioning.
    let scrollTimeout = gsap.delayedCall(1, () => (allowScroll = true)).pause(); // controls how long we should wait after an Observer-based animation is initiated before we allow another scroll-related action
    const time = 0.5; // animation duration
    let animating = false; // state
    let gap = 20

    gsap.set(".hero-wrapper",{
        display: "grid",
    })
    // Progressive enhancement
    gsap.set(".hero-wrapper .hero", {
        gridArea: "1 / 1 / 2 / 2", // 所有卡片都在同一个格子里
        y: (index) => gap * index,
        transformOrigin: "center top"
    });

    //--------------------------------//
    // The timeline
    //--------------------------------//
    const tl = gsap.timeline({
        paused: true
    });

    const cards = gsap.utils.toArray('.hero-wrapper .hero')

    cards.forEach((card, i) => {
        if (i === 0) return;

        tl.add(`card${i}`);

        tl.to(cards[i - 1], {
            scale: 0.85 + (i - 1) * (0.15 / cards.length),
            duration: time
        });

        tl.from(card, {
            y: () => window.innerHeight,
            duration: time
        }, "<");
    });
    tl.add(`card${cards.length + 1}`)

    // END The timeline --------------//

    function tweenToLabel(direction, isScrollingDown) {
        if (
            (!tl.nextLabel() && isScrollingDown) ||
            (!tl.previousLabel() && !isScrollingDown)
        ) {
            cardsObserver.disable(); // resume native scroll
            return;
        }
        if (!animating && direction) {
            // Check if we're already animating
            animating = true;
            tl.tweenTo(direction, { onComplete: () => (animating = false) });
        }
    }

    //--------------------------------//
    // Observer plugin
    //--------------------------------//
    const cardsObserver = Observer.create({
        // type: "wheel,touch,pointer",
        wheelSpeed: -1,
        onDown: (self) => tweenToLabel(tl.previousLabel(), false),
        onUp: (self) => tweenToLabel(tl.nextLabel(), true),
        tolerance: 10,
        preventDefault: true,
        onEnable(self) {
            allowScroll = false;
            scrollTimeout.restart(true);
            // when enabling, we should save the scroll position and freeze it. This fixes momentum-scroll on Macs, for example.
            let savedScroll = self.scrollY();
            self._restoreScroll = () => self.scrollY(savedScroll); // if the native scroll repositions, force it back to where it should be
            document.addEventListener("scroll", self._restoreScroll, {
                passive: false
            });
        },
        onDisable: (self) =>
            document.removeEventListener("scroll", self._restoreScroll)
    });

    cardsObserver.disable(); // Disable one page load
    // END Observer plugin --------------//

    //--------------------------------//
    // ScrollTrigger that disables the scroll and has the Observer plugin take over
    //--------------------------------//
    ScrollTrigger.create({
        id: "STOP-SCROLL",
        trigger: ".hero-wrapper",
        pin: true,
        start: "top 20%",
        markers: true,
        end: "+=35",
        onEnter: (self) => {
            if (cardsObserver.isEnabled) return;
            cardsObserver.enable(); // STOP native scrolling
        },
        onEnterBack: (self) => {
            if (cardsObserver.isEnabled) return;
            cardsObserver.enable(); // STOP native scrolling
        }
    });

    // END ScrollTrigger that disables the scroll and has the Observer plugin take over  --------------//
}