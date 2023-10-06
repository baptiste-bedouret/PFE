// https://jestjs.io/docs/timer-mocks
// https://jestjs.io/docs/expect
// https://codewithhugo.com/jest-stub-mock-spy-set-clear/

const TextEncodingPolyfill = require('text-encoding');
Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

global.$ = require('jquery');
jest.mock('jquery', () => ({
    ajax: jest.fn(),
}));

//simulate localStorage
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('data/scratch');
global.localStorage = localStorage;

//import functions from script.js
const {displayFirstImage, choiceControl, displayNewImage, setIndex, getChoices, getIndex, setChoices, getTimes, setTimes} = require('../site/front/js/script');
const {imgs, sups, label1, label2, index} = require('../site/front/js/script');


let dom;
beforeAll(() => {
    //load HTML file and create JSDOM object
    const imgs1=["COCO_train2014_000000000009_blur-k-1.5-0.jpg", "COCO_train2014_000000000009_blur-k-1.5-1.jpg", "COCO_train2014_000000000009_blur-k-1.5-2.jpg", "COCO_train2014_000000000009_blur-k-1.5-3.jpg", "COCO_train2014_000000000009_blur-k-1.5-0.jpg", "COCO_train2014_000000000009_blur-k-1.5-1.jpg", "COCO_train2014_000000000009_blur-k-1.5-2.jpg"];
    const imgs2=["COCO_train2014_000000000009_blur-k-1.5-0_FEM_sup.jpg", "COCO_train2014_000000000009_blur-k-1.5-1_FEM_sup.jpg", "COCO_train2014_000000000009_blur-k-1.5-2_FEM_sup.jpg", "COCO_train2014_000000000009_blur-k-1.5-3_FEM_sup.jpg", "COCO_train2014_000000000009_blur-k-1.5-0_FEM_sup.jpg", "COCO_train2014_000000000009_blur-k-1.5-1_FEM_sup.jpg", "COCO_train2014_000000000009_blur-k-1.5-2_FEM_sup.jpg"];
    const labels1=["classe", "classe1", "classe2", "classe3", "classe4", "classe5", "classe6"];
    const labels2=["classe7", "classe8", "classe9", "classe10", "classe11", "classe12", "classe13"];
    localStorage.setItem('imgs1', JSON.stringify(imgs1));
    localStorage.setItem('imgs2', JSON.stringify(imgs2));
    localStorage.setItem('labels1', JSON.stringify(labels1));
    localStorage.setItem('labels2', JSON.stringify(labels2));

    return JSDOM.fromFile('../site/front/html/experiment.html', {
        resources: "usable",
        runScripts: "dangerously"
    }).then(tmp_dom => {
        dom = tmp_dom;
        global.document = dom.window.document;
    });
});


describe('During the training phase, does not take into account', () => {
    beforeEach(() => {
        displayFirstImage(0);
        document.getElementById("img").src = `back/data/images/${imgs[0]}`;
        document.getElementById("superimposed").src = `back/data/images/${sups[0]}`;
    });

    test.each(["excellent", "good", "fair", "poor", "bad", "null"])('choice with quality=%s', (quality) => {
        const button = {id: quality};
        [0, 1, 2].forEach(num => {
            setIndex(num);
            const size_before = getChoices().length;
            choiceControl(button);
            const size_after = getChoices().length;
            expect(size_after).toEqual(size_before);
            expect(size_after).toEqual(0);
        });
    });

    test.each(["excellent", "good", "fair", "poor", "bad", "null"])('time with quality=%s', (quality) => {
        [0, 1, 2].forEach(num => {
            setIndex(num);
            const size_before = getTimes().length;
            choiceControl(quality);
            const size_after = getTimes().length;
            expect(size_after).toEqual(size_before);
            expect(size_after).toEqual(0);
        });
    });
});


test.each(["excellent", "good", "fair", "poor", "bad", "null"])('display next images with quality=%s', (quality) => {
    let idx = 0;
    setIndex(0);
    displayFirstImage(0);
    jest.useFakeTimers();
    jest.advanceTimersByTime(10000);
    jest.spyOn(global, 'setTimeout');
    const img_before = (dom.window.document.getElementById("img").src).substring((dom.window.document.getElementById("img").src).length - 44);
    const sup_before = (dom.window.document.getElementById("superimposed").src).substring((dom.window.document.getElementById("superimposed").src).length - 52);

    expect(imgs[idx]).toEqual(img_before);
    expect(sups[idx]).toEqual(sup_before);

    choiceControl(quality);
    expect(setTimeout).toHaveBeenCalledWith(displayNewImage, 5000);
    jest.advanceTimersByTime(5000);
    idx ++;

    document.getElementById("img").src = `back/data/images/${imgs[1]}`;
    document.getElementById("superimposed").src = `back/data/images/${sups[1]}`;

    const img_after = (dom.window.document.getElementById("img").src).substring((dom.window.document.getElementById("img").src).length - 44);
    const sup_after = (dom.window.document.getElementById("superimposed").src).substring((dom.window.document.getElementById("superimposed").src).length - 52);
    expect(img_before).not.toEqual(img_after);
    expect(sup_before).not.toEqual(sup_after);

    document.getElementById("img").src = `back/data/images/${imgs[0]}`;
    document.getElementById("superimposed").src = `back/data/images/${sups[0]}`;
    expect(imgs[idx]).toEqual(img_after);
    expect(sups[idx]).toEqual(sup_after);
});


test.each(["excellent", "good", "fair", "poor", "bad", "null"])('display next labels with quality=%s', (quality) => {
    let idx = 0;
    setIndex(0);
    displayFirstImage(0);
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    const ground_tr_before = dom.window.document.getElementById("ground_tr").innerHTML;
    const class_before = dom.window.document.getElementById("classification").innerHTML;

    let label = "<p>".concat(label2[idx], "</p>");
    expect(label).toEqual(ground_tr_before);
    expect(label1[idx]).toEqual(class_before);

    choiceControl(quality);
    expect(setTimeout).toHaveBeenCalledWith(displayNewImage, 5000);
    jest.advanceTimersByTime(5000);
    idx ++;

    const ground_tr_after = dom.window.document.getElementById("ground_tr").innerHTML;
    const class_after = dom.window.document.getElementById("classification").innerHTML;
    expect(ground_tr_before).not.toEqual(ground_tr_after);
    expect(class_before).not.toEqual(class_after);

    label = "<p>".concat(label2[idx], "</p>");
    expect(label).toEqual(ground_tr_after);
    expect(label1[idx]).toEqual(class_after);
});


test.each(["excellent", "good", "fair", "poor", "bad", "null"])('displays only the background for 5 seconds after choice=%s', (quality) => {
    jest.useFakeTimers();
    setIndex(3);
    displayNewImage();
    const display = dom.window.document.getElementById("container").style.display;
    expect(display).toEqual("flex");

    choiceControl(quality);

    const hidden = dom.window.document.getElementById("container").style.display;
    expect(hidden).toEqual("none");

    jest.advanceTimersByTime(5000);

    const after = dom.window.document.getElementById("container").style.display;
    expect(after).toEqual("flex");
    jest.useRealTimers();
});


describe('save the user time to evaluate', () => {
    let time_choice = 7;
    let advance_time = 7000;
    beforeEach(() => {
        setIndex(3);
        time_choice --;
        advance_time -= 1000;
        jest.useFakeTimers();
        displayNewImage();
        setTimes();
    });

    test.each(['excellent', "good", "fair", "poor", "bad", "null"])('with quality=%s', (quality) => {
        jest.advanceTimersByTime(advance_time);

        choiceControl(quality);

        let tab_timer_after = getTimes();
        expect(tab_timer_after.length).toEqual(1);
        expect(tab_timer_after[0]).toEqual(time_choice);

    });

});


describe('save the user choice', () => {
    let choice=6;
    setChoices();
    beforeEach(() => {
        setIndex(3);
        setChoices();
        choice --;
    });

    test.each(['excellent', "good", "fair", "poor", "bad", "null"])('evaluation with quality=%s', (quality) => {
        const button = {id: quality};
        const tab_size = getChoices().length;

        choiceControl(button);

        const tab_size_after = getChoices().length;
        expect(tab_size_after).toEqual(tab_size + 1);
        const tab_choices = getChoices();
        expect(tab_choices[0]).toEqual(choice);
    });

})


test('display an information between the end of the training phase and the beginning of the evaluation', () => {
    displayFirstImage(0);
    setIndex(2);
    const button={id:"null"};

    const button_before = dom.window.document.getElementById("button").style.display;
    const eval_before = dom.window.document.getElementById("test").innerHTML;
    const container_before = dom.window.document.getElementById("container").style.display;
    expect(button_before).toEqual("none");
    expect(eval_before).toEqual("");
    expect(container_before).toEqual("flex");

    choiceControl(button);

    const button_between = dom.window.document.getElementById("button").style.display;
    const eval_between = dom.window.document.getElementById("test").innerHTML;
    const container_between = dom.window.document.getElementById("container").style.display;
    expect(button_between).toEqual("inline-block");
    expect(eval_between).toEqual("Session d'évaluation");
    expect(container_between).toEqual("none");
});


describe('when the user launch a session ', () => {
    test('displays an evaluation form', () => {
        displayFirstImage(0);
        const container = dom.window.document.getElementById("container").style.display;
        expect(container).toEqual("flex");
    });
});


test("impose 20 seconds to make a choice for the user", () => {
    jest.useFakeTimers();
    displayFirstImage(0);
    setIndex(0);

    var container = dom.window.document.getElementById("container").style.display;
    expect(container).toEqual("flex");

    jest.advanceTimersByTime(20000);

    container = dom.window.document.getElementById("container").style.display;
    expect(container).toEqual("none");

    jest.advanceTimersByTime(5000);

    container = dom.window.document.getElementById("container").style.display;
    expect(container).toEqual("flex");

    jest.advanceTimersByTime(20000);

    container = dom.window.document.getElementById("container").style.display;
    expect(container).toEqual("none");

    jest.useRealTimers();
});


test("test if the deconnection button is displayed during the experiment", () => {
    jest.useFakeTimers();
    displayNewImage();
    setIndex(3);

    const deconnection_button_show = dom.window.document.getElementById("dbutton").style.display;
    expect(deconnection_button_show).toEqual("inline-block");

    jest.advanceTimersByTime(20000);

    const deconnection_button_hide = dom.window.document.getElementById("dbutton").style.display;
    expect(deconnection_button_hide).toEqual("none");

    jest.advanceTimersByTime(5000);

    const deconnection_button_show2 = dom.window.document.getElementById("dbutton").style.display;
    expect(deconnection_button_show2).toEqual("inline-block");

    jest.useRealTimers();
});
