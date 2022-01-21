class Widget {
    constructor() {
        this.numberSlider = 9; //любое число - начальное количество слайдов (контролируется)
        this.body = document.querySelector('body');
        this.widget = document.querySelector('.widget');
        this.containerLists = document.querySelector('.widget__checklist');
        this.allLists = [];
        this.bottomText = document.querySelector('.widget__bottom-text');
        this.count = 0;
        this.data = data;
        this.pressOnWidget = null;
        this.firstPointX = null;
        this.firstPointY = null;
        this.numberTranslateX = null;
        this.numberTranslateY = null;
        this.firstPress = this.firstPress.bind(this);
        this.moveElement = this.moveElement.bind(this);
        this.lastPress = this.lastPress.bind(this);
        this.spaceLeft = null;
        this.spaceTop = null;
        this.configLists = [];
        this.startPosXLeft = null;
        this.startPosXRight = null;
        this.finalPosXLeft = null;
        this.finalPosXRight = null;
        this.wasInit = false;
        this.firstText = null;
        this.secondText = null;
    }

    init(numb) {
        if (numb <= switcher.minSliders) return;
        if (numb > switcher.maxSliders) numb = switcher.maxSliders;

        for (numb; numb > 0; numb--) this.createList(numb);
        
        this.allLists[0].firstChild.addEventListener('pointerdown', this.firstPress);
        this.allLists[0].classList.add('active');

        this.createBotText();
        this.wasInit = true;
    }

    updateArrSliders() {
        this.allLists = Array.from(document.querySelectorAll('.widget__list')).filter(el => !el.closest('.clone'));
        if (this.allLists.length === 1) this.allLists[0].classList.add('not__allowed');
        else this.allLists[0]?.classList.remove('not__allowed');
    }

    createList(zIndex) {
        this.containerLists.append(this.stylesLists(zIndex));
        this.updateArrSliders();
        this.createContentWidget();
    }

    stylesLists(zIndex) {
        const li = document.createElement('li');
        li.className = "widget__list";
        li.style.zIndex = zIndex;
        li.style.transform = 'translate(0px, 0px)';

        const animatedArea = document.createElement('span');
        animatedArea.className = "animated__area";
        li.prepend(animatedArea);

        if (this.allLists.length === 0) {
            this.configLists.push({
                sizeX: 1,
                sizeY: 1,
                zIndex: zIndex
            });
            li.firstChild.style.transform = 'scale(1,1)';
            return li;
        } else {
            const prevSizeX = this.allLists[this.allLists.length - 1].firstChild.style.transform.replace(/scale\(/g, '').replace(/\)/, '').split(', ')[0];
            const prevSizeY = this.allLists[this.allLists.length - 1].firstChild.style.transform.replace(/scale\(/g, '').replace(/\)/, '').split(', ')[1];
            const sizeX = +prevSizeX + 0.08;
            const sizeY = +prevSizeY - 0.05;

            const obj = {
                sizeX: sizeX,
                sizeY: sizeY,
                zIndex: zIndex
            }
            this.configLists.push(obj);
            li.firstChild.style.transform = `scale(${sizeX},${sizeY})`;
            return li;
        }
    }

    createContentWidget() {
        if (this.count === this.data.length) this.count = 0;
        console.log(this.count)

        const containerContent = document.createElement('span');
        containerContent.className = "container__content";

        const img = document.createElement('img');
        img.src = this.data[this.count].imgUrl;
        containerContent.append(img);

        const spanContainerText = document.createElement('span');
        if (this.allLists.length > 1) spanContainerText.className = "widget__container-text";
        else spanContainerText.className = "widget__container-text active";
        containerContent.append(spanContainerText);

        const text = document.createElement('span');
        text.innerText = this.data[this.count].textList;
        text.className = "widget__text";
        spanContainerText.append(text);

        const background = document.createElement('span');
        background.className = "widget__background";
        spanContainerText.append(background);

        const lastSlide = this.allLists[this.allLists.length - 1]
        lastSlide.append(containerContent);

        this.count++;
    }

    createBotText() {
        const firstText = document.createElement('span');
        firstText.className = "first_replacer_text active";
        firstText.innerText = this.data[0].textBottom;
        this.bottomText.prepend(firstText);
        this.firstText = firstText;

        const secondText = document.createElement('span');
        secondText.className = "second_replacer_text";
        this.bottomText.append(secondText);
        this.secondText = secondText;
    }

    changeBotText() {
        //зависит от пути картинок
        const stringPathImg = this.allLists.find(el => el.closest('.active')).querySelector('img').src;
        const nameImg = stringPathImg.substring(stringPathImg.indexOf('img'))
        const indexImgData = this.data.findIndex(obj => obj.imgUrl === nameImg)
        //зависит от пути картинок

        if(!this.firstText.closest('.active')) {
            this.firstText.innerText = this.data[indexImgData].textBottom;
            if(this.firstText.innerText === this.secondText.innerText) return
            this.firstText.classList.add('active');
            this.secondText.classList.remove('active');
        } else {
            this.secondText.innerText = this.data[indexImgData].textBottom;
            if(this.firstText.innerText === this.secondText.innerText) return
            this.secondText.classList.add('active');
            this.firstText.classList.remove('active');
        }
    }

    firstPress(event) {
        event.preventDefault();
        const target = event.target.closest('.animated__area');
        if (!target || this.allLists.length <= 1 || this.allLists[0].closest('.return')) return;

        this.body.classList.add('grabbing');

        this.startPosXLeft = this.allLists[0].getBoundingClientRect().left;
        this.startPosXRight = this.allLists[0].getBoundingClientRect().right;

        this.spaceTop = this.allLists[0].getBoundingClientRect().top;
        this.spaceLeft = this.allLists[0].getBoundingClientRect().left;

        this.firstPointX = event.clientX - this.allLists[0].getBoundingClientRect().left;
        this.firstPointY = event.clientY - this.allLists[0].getBoundingClientRect().top;

        document.addEventListener('pointermove', this.moveElement);
        document.addEventListener('pointerup', this.lastPress);
    };

    lastPress() {
        this.body.classList.remove('grabbing');

        this.finalPosXRight = this.allLists[0].getBoundingClientRect().right;
        this.finalPosXLeft = this.allLists[0].getBoundingClientRect().left;

        if ((this.finalPosXLeft - this.startPosXLeft) > this.allLists[0].offsetWidth / 6) this.shiftToEnd();
        else if ((this.finalPosXRight - this.startPosXRight) < -(this.allLists[0].offsetWidth / 6)) this.shiftToEnd();
        else this.shiftToStart();
    };

    shiftToStart() {
        document.removeEventListener('pointermove', this.moveElement);
        document.removeEventListener('pointerup', this.lastPress);
        if (this.allLists[0].style.transform !== 'translate(0px, 0px)') this.allLists[0].classList.add('return');

        const anim = (event) => {
            if (event.target === this.allLists[0]) {
                this.allLists[0].classList.remove('return');
                this.allLists[0].removeEventListener('transitionend', anim);
            }
        }

        this.allLists[0].addEventListener('transitionend', anim);

        this.allLists[0].style.transform = 'translate(0px, 0px)';
    }

    shiftToEnd() {
        switcher.containerSwitch.classList.add('not__press')
        const swapElem = this.allLists[0];

        swapElem.firstChild.removeEventListener('pointerdown', this.firstPress);
        document.removeEventListener('pointermove', this.moveElement);
        document.removeEventListener('pointerup', this.lastPress);

        this.containerLists.append(swapElem);
        this.updateArrSliders();

        const clone = swapElem.cloneNode(true);
        clone.classList.add('clone');
        swapElem.after(clone);

        swapElem.firstChild.classList.add('hidden');

        swapElem.classList.remove('active');
        
        swapElem.childNodes[1].remove(); //удалить предыдущий контейнер контента
        this.createContentWidget();

        clone.addEventListener('animationend', () => {
            this.changeBotText();
            swapElem.firstChild.classList.remove('hidden');
            clone.remove();
            
        }, { once: true });

        swapElem.firstChild.addEventListener('transitionend', (event) => {
            if (event.target === swapElem.firstChild) switcher.containerSwitch.classList.remove('not__press');
        }, { once: true })

        this.updateArrSliders();

        this.stepMoveElements();

        const newElem = this.allLists[0];
        newElem.classList.add('active');

        const containerContent = newElem.querySelector('.container__content');
        const containerText = newElem.querySelector('.widget__container-text');

        const anim = (event) => {
            if (event.target === containerContent) containerText.classList.add('active');
        }

        containerContent.addEventListener('transitionend', anim);

        newElem.firstChild.addEventListener('pointerdown', this.firstPress);
    }

    stepMoveElements() {
        this.allLists.forEach((el, i) => {
            el.style.transform = `translate(0px, 0px)`;
            el.style.zIndex = this.configLists[i].zIndex;
            el.firstChild.style.transform = `scale(${this.configLists[i].sizeX}, ${this.configLists[i].sizeY})`;
        });
    }

    moveAt(clientX, clientY) {
        this.numberTranslateX = (clientX - this.firstPointX - this.spaceLeft);
        this.numberTranslateY = (clientY - this.firstPointY - this.spaceTop);
        this.allLists[0].style.transform = `translate(${this.numberTranslateX}px, ${this.numberTranslateY}px)`;
    }

    moveElement(event) {
        event.preventDefault();
        this.moveAt(event.clientX, event.clientY);
    }
}

const widget = new Widget();
const switcher = new Switcher();

widget.init(widget.numberSlider);
switcher.init();