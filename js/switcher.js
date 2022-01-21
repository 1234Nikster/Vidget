class Switcher {
    constructor() {
        this.maxSliders = 16; //главный контроллер максимального числа слайдов
        this.minSliders = 0; //главный контроллер минимального числа слайдов
        this.containerSwitch = null;
        this.buttonPlus = null;
        this.buttonMinus = null;
        this.screen = null;
        this.firstNumb = null;
        this.secondNumb = null;
        this.pressOnPlus = this.pressOnPlus.bind(this);
        this.pressOnMinus = this.pressOnMinus.bind(this);
    }

    init() {
        this.createSwitch()
        this.buttonPlus.addEventListener('pointerdown', this.pressOnPlus);
        this.buttonMinus.addEventListener('pointerdown', this.pressOnMinus);

        if (widget.allLists.length === this.maxSliders) this.buttonPlus.classList.add('no__drop');
        if (widget.allLists.length === this.minSliders) this.buttonMinus.classList.add('no__drop');
    }

    pressOnPlus(event) {
        const target = event.target.closest('.button__plus');
        if (!target || widget.allLists.length === this.maxSliders || this.containerSwitch.closest('.not__press')) return;

        this.buttonMinus.classList.remove('no__drop');

        if (widget.allLists.length === this.maxSliders - 1) this.buttonPlus.classList.add('no__drop');

        this.addElem();
    }

    pressOnMinus(event) {
        const target = event.target.closest('.button__minus');
        if (!target || widget.allLists.length === this.minSliders || this.containerSwitch.closest('.not__press')) return;

        this.buttonPlus.classList.remove('no__drop');

        if (widget.allLists.length === this.minSliders + 1) this.buttonMinus.classList.add('no__drop');

        this.removeElem();
    }

    addElem() {
        if (widget.allLists.length === 0 && !widget.wasInit) {
            widget.init(1);
            this.changeNumbScreen();
        }
        else if (widget.allLists.length === 0 && widget.wasInit) this.createFirstSlide();
        else {
            const lastSlide = widget.allLists[widget.allLists.length - 1];
            const zIndexLastSlide = lastSlide.style.zIndex;
            widget.createList(zIndexLastSlide - 1);
            this.changeNumbScreen();
        }
    }

    removeElem() {
        const lastSlide = widget.allLists[widget.allLists.length - 1];

        if (widget.allLists.length === 1) widget.bottomText.classList.add('hidden');

        lastSlide.remove();
        widget.configLists.splice(widget.configLists.length - 1, 1);
        widget.count--

        if (widget.count < 0) widget.count = widget.data.length - 1;
        
        widget.updateArrSliders();
        this.changeNumbScreen();
    }

    changeNumbScreen() {
        if (!this.firstNumb.closest('.active')) {
            this.firstNumb.innerText = widget.allLists.length;
            this.firstNumb.classList.add('active');
            this.secondNumb.classList.remove('active');
        } else {
            this.secondNumb.innerText = widget.allLists.length;
            this.secondNumb.classList.add('active');
            this.firstNumb.classList.remove('active');
        }
    }

    createSwitch() {
        const containerSwitch = document.createElement('div');
        containerSwitch.className = "container__switch";
        widget.body.prepend(containerSwitch);
        this.containerSwitch = containerSwitch;

        const buttonPlus = document.createElement('div');
        buttonPlus.className = "button__plus";
        containerSwitch.prepend(buttonPlus);
        buttonPlus.innerText = '+';
        this.buttonPlus = buttonPlus;

        const screen = document.createElement('div');
        screen.className = "screen__switch";
        containerSwitch.prepend(screen);
        this.screen = screen;

        const firstNumb = document.createElement('span');
        firstNumb.className = "first_replacer_numb active";
        firstNumb.innerText = widget.allLists.length;
        screen.prepend(firstNumb);
        this.firstNumb = firstNumb;

        const secondNumb = document.createElement('span');
        secondNumb.className = "second_replacer_numb";
        screen.append(secondNumb);
        this.secondNumb = secondNumb;

        const buttonMinus = document.createElement('div');
        buttonMinus.className = "button__minus";
        containerSwitch.prepend(buttonMinus);
        buttonMinus.innerText = '-';
        this.buttonMinus = buttonMinus;
    }

    createFirstSlide() {
        widget.createList(1);
        const firstSlide = widget.allLists[0];
        firstSlide.firstChild.addEventListener('pointerdown', widget.firstPress);
        firstSlide.classList.add('active');
        widget.bottomText.classList.remove('hidden');
        this.changeNumbScreen();
    }
}