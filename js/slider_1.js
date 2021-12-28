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
            // timer: Number,
        }
    ) {
        this.slider = document.querySelector(`#${s.id}`);
        this.wrapper = document.querySelector(`#${s.id} .${s.wrapper_class}`);
        this.elements = Array.from(this.wrapper.children);
        this.navigation = document.querySelector(`#${s.id} .${s.navigation}`);
        if (this.navigation) {
            SliderSimple.addNavigationCSS(this);
            this.prev = this.navigation.firstElementChild;
            this.next = this.navigation.lastElementChild.firstElementChild;
            this.next.addEventListener("click", this.slideNext.bind(this));
            this.prev.addEventListener("click", this.slidePrevious.bind(this));
            console.log("prev:", this.prev, " next:", this.next);
        }
        this.controlPlay = document.querySelector(`#${s.control_playId}`);
        this.controlStop = document.querySelector(`#${s.control_stopId}`);
        this.controlPrev = document.querySelector(`#${s.control_prevId}`);
        this.controlNext = document.querySelector(`#${s.control_nextId}`);
        if (this.controlPlay) {
            this.controlPlay.addEventListener(
                "click",
                this.startTimer.bind(this)
            );
        }
        if (this.controlStop) {
            this.controlStop.addEventListener(
                "click",
                this.stopTimer.bind(this)
            );
        }
        if (this.controlNext) {
            console.log("cNEXT:");
            this.controlNext.addEventListener(
                "click",
                this.slideNext.bind(this)
            );
        }
        if (this.controlPrev) {
            this.controlPrev.addEventListener(
                "click",
                this.slidePrevious.bind(this)
            );
        }
        this.dotsContainer = document.querySelector(`#${s.dotsId}`);
        if (this.dotsContainer) {
            this.createDots();
        }

        this.padding = s.padding ?? 0;
        this.gutter = s.gutter ?? 0;
        this.timing = s.timing ?? 2500;
        this.speed = s.speed ?? 1500;
        this.autoplay = s.autoplay ?? true;
        if (this.autoplay) {
            this.startTimer();
            this.addListenerTimerMouseInOut();
            console.log("__AUTOPLAY__:");
        }

        this.wrapper.addEventListener(
            "touchstart",
            this.touchStart.bind(this, event),
            false
        );
        this.wrapper.addEventListener(
            "touchend",
            this.touchEnd.bind(this, event),
            false
        );
    }
    count = 0;
    clone;
    timerId;
    isInMovement = false;
    touchstartX = 0;
    touchstartY = 0;
    touchendX = 0;
    touchendY = 0;

    static addBaseCSS = function (vm) {
        vm.slider.classList.add("hls_slider");
        vm.wrapper.classList.add("hls_wrapper");
        if (vm.padding > 0) {
            vm.elements.forEach((element) => {
                element.style.padding = `${vm.padding}px`;
            });
        }
        console.log("init:", vm.wrapper);
    };

    static cloneNode = function (vm) {
        vm.clone = vm.elements[0].cloneNode(true);
        vm.wrapper.append(vm.clone);
    };
    static addNavigationCSS = function (vm) {
        const sliderWidth = vm.slider.clientWidth;
        console.log("sliderWidth:", sliderWidth);
        vm.navigation.classList.add("hls_navigation");
        vm.navigation.style.padding = `${vm.padding}px`;
    };

    slideNext = function () {
        if (!this.isInMovement) {
            this.toggleIsInMovement();

            this.wrapper.style.transition = `${this.speed}ms linear`;
            this.count++;
            const position = -this.elements[0].clientWidth * this.count;
            this.wrapper.style.transform = `translateX(${position}px)`;
            setTimeout(() => {
                if (this.count >= this.wrapper.children.length - 1) {
                    this.count = 0;
                    this.wrapper.style.transition = "unset";
                    this.wrapper.style.transform = `translateX(${0}px)`;
                }
            }, this.speed);
        }
    };
    slidePrevious = function () {
        if (!this.isInMovement) {
            this.toggleIsInMovement();

            this.wrapper.style.transition = `${this.speed}ms linear`;
            this.count--;
            if (this.count < 0) {
                this.count = this.wrapper.children.length - 1;
                const position = -this.elements[0].clientWidth * this.count;
                this.wrapper.style.transition = "unset";
                this.wrapper.style.transform = `translateX(${position}px)`;

                this.isInMovement = false;
                setTimeout(this.slidePrevious.bind(this), 1);
            }
            const position = -this.elements[0].clientWidth * this.count;
            this.wrapper.style.transform = `translateX(${position}px)`;
        }
    };
    toggleIsInMovement = function () {
        if (!this.isInMovement) {
            this.isInMovement = true;
            setTimeout(() => {
                this.isInMovement = false;
            }, this.speed + 1);
        }
    };
    stopTimer = function () {
        console.log("stop");
        clearInterval(this.timerId);
    };
    startTimer = function () {
        console.log("start");
        this.timerId = setInterval(() => {
            this.slideNext();
        }, this.timing + this.speed);
    };
    addListenerTimerMouseInOut = function () {
        Array.from(this.wrapper.children).forEach((child) => {
            child.children[0].addEventListener(
                "mouseenter",
                this.stopTimer.bind()
            );
            child.children[0].addEventListener(
                "mouseout",
                this.startTimer.bind()
            );
        });
    };

    touchStart = function () {
        event.preventDefault();
        this.touchstartX = event.changedTouches[0].screenX;
    };
    touchEnd = function () {
        event.preventDefault();
        this.touchendX = event.changedTouches[0].screenX;
        this.handleGesture(this.touchendX, this.touchstartX);
    };

    handleGesture = function () {
        if (this.touchendX < this.touchstartX) {
            this.slideNext();
        }

        if (this.touchendX > this.touchstartX) {
            this.slidePrevious();
        }
    };

    createDots = function () {
        this.dotsContainer.classList.add("hls_dots-container");
        for (let i = 0; i < this.wrapper.children.length; i++) {
            const button = document.createElement("button");
            button.classList.add("dot");
            button.dataset.img = i;
            this.wrapper.children[i].dataset.img = i;
            this.dotsContainer.append(button);
            button.addEventListener("click", this.dotGoImg.bind(this, event));
        }
        console.log("length:", this.dotsContainer);
        this.dotsContainer.firstElementChild.classList.add("active");
    };
    dotGoImg() {
        const target = event.target;
        Array.from(this.dotsContainer.children).forEach((child) => {
            child.classList.remove("active");
        });
        target.classList.add("active");
        this.count = target.dataset.img - 1;
        this.isInMovement = false;
        this.slideNext();
    }
    static test = function () {
        return console.log("static test");
    };
    init() {
        // addBaseCSS(this.slider, this.wrapper, this.elements, this.padding);
        // this.cloneNode();
        SliderSimple.addBaseCSS(this);
        SliderSimple.cloneNode(this);
        SliderSimple.test();
        console.log("init:", this);
    }
}

export { SliderSimple };
