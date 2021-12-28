import { SliderSimple } from "./js/slider_1.js";

window.onload = () => {
    const slider1 = new SliderSimple({
        id: "slider_1",
        wrapper_class: "slider_wrapper",
        navigation: "navigation",
        padding: 5,
        autoplay: false,
        control_playId: "slider_1-play",
        control_stopId: "slider_1-stop",
        control_prevId: "slider_1-prev",
        control_nextId: "slider_1-next",
        dotsId: "slider_1-dots",
    });
    slider1.init();
    // const slider2 = new SliderSimple({
    //     id: "slider_2",
    //     wrapper: "slider_wrapper",
    //     navigation: "navigation",
    //     padding: 15,
    //     speed: 1200,
    //     gut
    // });
    // slider2.init();
};
