class SliderSimple {
    /**
     *
     * @param {string} id id name OBLIGATORY
     * @param {string} wrapper_class class name OBLIGATORY
     * @param {string} navigation class name
     * @param {number} padding in px. Default 0
     * @param {number} gutter in px. Default 0
     * @param {number} timing in ms. Default 2500ms
     * @param {number} speed in ms. Default 1500ms
     * @param {boolean} autoplay default is true
     * @param {string} control_playId id name
     * @param {string} control_stopId id name
     * @param {string} control_prevId id name
     * @param {string} control_nextId id name
     * @param {string} dotsId id name
     */

    constructor(
        s = {
            id: String,
            wrapper_class: String,
            navigation: String,
            padding: Number,
            gutter: Number,
            timing: Number,
            speed: Number,
            autoplay: Boolean,
            control_playId: String,
            control_stopId: String,
            control_prevId: String,
            control_nextId: String,
            dotsId: String,
        }
    ) {
        this.slider = document.querySelector(`#${s.id}`);
        this.wrapper = document.querySelector(`#${s.id} .${s.wrapper_class}`);
        this.elements = Array.from(this.wrapper.children);
        this.navigation = document.querySelector(`#${s.id} .${s.navigation}`);
        this.controlPlay = document.querySelector(`#${s.control_playId}`);
        this.controlStop = document.querySelector(`#${s.control_stopId}`);
        this.controlPrev = document.querySelector(`#${s.control_prevId}`);
        this.controlNext = document.querySelector(`#${s.control_nextId}`);
        this.dotsContainer = document.querySelector(`#${s.dotsId}`);

        this.padding = s.padding ?? 0;
        this.gutter = s.gutter ?? 0;
        this.timing = s.timing ?? 2500;
        this.speed = s.speed ?? 1500;
        this.autoplay = s.autoplay ?? true;
    }

    static COUNT = 0;
    static CLONE;
    static TIMER_ID;
    static IS_IN_MOVEMENT = false;
    static TOUCH_START_X = 0;
    static TOUCH_END_X = 0;

    static addBaseCSS = function (vm) {
        vm.slider.classList.add("hls_slider");
        vm.wrapper.classList.add("hls_wrapper");
        if (vm.padding > 0) {
            vm.elements.forEach((element) => {
                element.style.padding = `${vm.padding}px`;
            });
        }
    };

    static cloneNode = function (vm) {
        SliderSimple.CLONE = vm.elements[0].cloneNode(true);
        vm.wrapper.append(SliderSimple.CLONE);
    };
    static addNavigationCSS = function (vm) {
        vm.navigation.classList.add("hls_navigation");
        vm.navigation.style.padding = `${vm.padding}px`;
    };

    static checkElementExistAndAddListener(vm) {
        if (vm.controlNext) {
            vm.controlNext.addEventListener(
                "click",
                SliderSimple.slideNext.bind(vm)
            );
        }
        if (vm.controlPrev) {
            vm.controlPrev.addEventListener(
                "click",
                SliderSimple.slidePrevious.bind(vm)
            );
        }
        if (vm.controlPlay) {
            vm.controlPlay.addEventListener(
                "click",
                SliderSimple.startTimer.bind(vm)
            );
        }
        if (vm.controlStop) {
            vm.controlStop.addEventListener(
                "click",
                SliderSimple.stopTimer.bind(vm)
            );
        }
        if (vm.dotsContainer) {
            SliderSimple.createDots(vm);
        }
        if (vm.navigation) {
            SliderSimple.addNavigationCSS(vm);
            vm.prev = vm.navigation.firstElementChild;
            vm.next = vm.navigation.lastElementChild.firstElementChild;
            vm.next.addEventListener("click", SliderSimple.slideNext.bind(vm));
            vm.prev.addEventListener(
                "click",
                SliderSimple.slidePrevious.bind(vm)
            );
        }
        if (vm.autoplay) {
            SliderSimple.startTimer.bind(vm)();
            SliderSimple.addListenerTimerMouseInOut.bind(vm)();
        }

        vm.wrapper.addEventListener(
            "touchstart",
            SliderSimple.touchStart.bind(vm, event),
            false
        );
        vm.wrapper.addEventListener(
            "touchend",
            SliderSimple.touchEnd.bind(vm, event),
            false
        );
    }

    static slideNext = function () {
        if (!SliderSimple.IS_IN_MOVEMENT) {
            SliderSimple.toggleIsInMovement(this);
            this.wrapper.style.transition = `${this.speed}ms linear`;
            SliderSimple.COUNT++;
            const position = -this.elements[0].clientWidth * SliderSimple.COUNT;
            this.wrapper.style.transform = `translateX(${position}px)`;
            setTimeout(() => {
                if (SliderSimple.COUNT >= this.wrapper.children.length - 1) {
                    SliderSimple.COUNT = 0;
                    this.wrapper.style.transition = "unset";
                    this.wrapper.style.transform = `translateX(${0}px)`;
                }
            }, this.speed);
        }
    };
    static slidePrevious = function () {
        if (!SliderSimple.IS_IN_MOVEMENT) {
            SliderSimple.toggleIsInMovement(this);

            this.wrapper.style.transition = `${this.speed}ms linear`;
            SliderSimple.COUNT--;
            if (SliderSimple.COUNT < 0) {
                SliderSimple.COUNT = this.wrapper.children.length - 1;
                const position =
                    -this.elements[0].clientWidth * SliderSimple.COUNT;
                this.wrapper.style.transition = "unset";
                this.wrapper.style.transform = `translateX(${position}px)`;

                SliderSimple.IS_IN_MOVEMENT = false;
                setTimeout(SliderSimple.slidePrevious.bind(this), 1);
            }
            const position = -this.elements[0].clientWidth * SliderSimple.COUNT;
            this.wrapper.style.transform = `translateX(${position}px)`;
        }
    };
    static toggleIsInMovement = function (vm) {
        if (!SliderSimple.IS_IN_MOVEMENT) {
            SliderSimple.IS_IN_MOVEMENT = true;
            setTimeout(() => {
                SliderSimple.IS_IN_MOVEMENT = false;
            }, vm.speed + 1);
        }
    };
    static stopTimer = function () {
        clearInterval(SliderSimple.TIMER_ID);
    };
    static startTimer = function () {
        SliderSimple.TIMER_ID = setInterval(() => {
            SliderSimple.slideNext.bind(this);
        }, this.timing + this.speed);
    };
    static addListenerTimerMouseInOut = function () {
        console.log("startTimer:", this);
        Array.from(this.wrapper.children).forEach((child) => {
            child.children[0].addEventListener(
                "mouseenter",
                SliderSimple.stopTimer.bind(this)
            );
            child.children[0].addEventListener(
                "mouseout",
                SliderSimple.startTimer.bind(this)
            );
        });
    };

    static touchStart = function () {
        event.preventDefault();
        SliderSimple.TOUCH_START_X = event.changedTouches[0].screenX;
    };
    static touchEnd = function () {
        console.log("touch end:", this);

        event.preventDefault();
        SliderSimple.TOUCH_END_X = event.changedTouches[0].screenX;
        SliderSimple.handleGesture(
            this,
            SliderSimple.TOUCH_END_X,
            SliderSimple.TOUCH_START_X
        );
    };

    static handleGesture = function (vm) {
        if (SliderSimple.TOUCH_END_X < SliderSimple.TOUCH_START_X) {
            SliderSimple.slideNext.bind(vm);
        }

        if (SliderSimple.TOUCH_END_X > SliderSimple.TOUCH_START_X) {
            SliderSimple.slidePrevious.bind(vm);
        }
    };

    static createDots = function (vm) {
        vm.dotsContainer.classList.add("hls_dots-container");
        for (let i = 0; i < vm.elements.length; i++) {
            const button = document.createElement("button");
            button.classList.add("dot");
            button.dataset.img = i;
            vm.elements[i].dataset.img = i;
            vm.dotsContainer.append(button);
            button.addEventListener(
                "click",
                SliderSimple.dotGoImg.bind(vm, event)
            );
        }
        vm.dotsContainer.firstElementChild.classList.add("active");
    };
    static dotGoImg = function () {
        const target = event.target;
        Array.from(this.dotsContainer.children).forEach((child) => {
            child.classList.remove("active");
        });
        target.classList.add("active");
        SliderSimple.COUNT = target.dataset.img - 1;
        SliderSimple.IS_IN_MOVEMENT = false;
        SliderSimple.slideNext.bind(this)();
    };
    init() {
        SliderSimple.checkElementExistAndAddListener(this);
        SliderSimple.addBaseCSS(this);
        SliderSimple.cloneNode(this);

        console.log("__INIT__:", this);
    }
}

export { SliderSimple };
