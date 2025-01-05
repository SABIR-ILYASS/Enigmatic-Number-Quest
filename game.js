class Game {
    constructor() {
        this.LEVEL_MAX = 10;
        this.HEIGHT = 100;
        this.level = 1;
        this.round = 0;
        this.numberChoose = -1;
        this.listNumber = new Array(this.level).fill(-1);
        this.listMainNumber = Array.from({length: this.level}, () => Math.floor(Math.random() * 10));
        this.endGame = false;

        // Attendre que le DOM soit complètement chargé
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeElements();
            this.initializeEventListeners();
            this.loadSounds();
            this.createNumberPad();
            this.createCheckSlots();
            this.handleLoadingScreen();
        });
    }

    initializeElements() {
        // Initialiser tous les éléments du DOM
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.querySelector('.progress');
        this.progressContainer = document.querySelector('.progress-container');
        this.container = document.querySelector('.container');

        this.numberPad = document.getElementById('numberPad');
        this.numberChecks = document.getElementById('numberChecks');
        this.checkResults = document.getElementById('checkResults');
        this.checkButton = document.getElementById('checkButton');
        this.nextRoundButton = document.getElementById('nextRoundButton');
        this.nextLevelButton = document.getElementById('nextLevelButton');
        this.startGameButton = document.getElementById('startGameButton');
        this.endGameMessage = document.getElementById('endGameMessage');
        this.gameTitle = document.getElementById('gameTitle');
        this.levelInfo = document.getElementById('levelInfo');
        this.helpModal = document.getElementById('helpModal');
        this.closeHelpButton = document.getElementById('closeHelp');
    }

    initializeEventListeners() {
        this.checkButton.addEventListener('click', () => this.checkFunction());
        this.nextRoundButton.addEventListener('click', () => this.nextRoundFunction());
        this.nextLevelButton.addEventListener('click', () => this.nextLevel());
        this.startGameButton.addEventListener('click', () => this.startGame());
        document.getElementById('helpButton').addEventListener('click', () => this.showHelp());
        this.closeHelpButton.addEventListener('click', () => this.closeHelp());
        document.getElementById('startGameBtn').addEventListener('click', () => {
            document.getElementById('introScreen').style.display = 'none';
            this.container.style.display = 'block';
            this.startGame();
        });
    }

    loadSounds() {
        this.sounds = {
            click: document.getElementById('sound-click'),
            checkFalse: document.getElementById('sound-check-false'),
            error: document.getElementById('sound-error'),
            help: document.getElementById('sound-help'),
            nextRound: document.getElementById('sound-next-round'),
            put: document.getElementById('sound-put'),
            startGame: document.getElementById('sound-start-game'),
            congratulation: document.getElementById('sound-congratulation'),
            nextLevel: document.getElementById('sound-next-level'),
            success: document.getElementById('sound-success')
        };
    }

    createLoadingCircle() {
        const circleContainer = document.createElement('div');
        circleContainer.className = 'loading-circle';
        
        const outerCircle = document.createElement('div');
        outerCircle.className = 'circle-outer';
        
        const innerCircle = document.createElement('div');
        innerCircle.className = 'circle-inner';
        
        const centerText = document.createElement('div');
        centerText.className = 'circle-center';
        
        circleContainer.appendChild(outerCircle);
        circleContainer.appendChild(innerCircle);
        circleContainer.appendChild(centerText);
        
        return circleContainer;
    }

    handleLoadingScreen() {
        this.createStars();
        this.createFloatingNumbers();
        
        const title = document.createElement('div');
        title.className = 'loading-title';
        title.textContent = 'Enigmatic Number Quest';
        this.loadingScreen.appendChild(title);
        
        // Ajouter le cercle de chargement
        const loadingCircle = this.createLoadingCircle();
        this.loadingScreen.appendChild(loadingCircle);
        
        // Mettre à jour le pourcentage dans le cercle uniquement
        const centerText = loadingCircle.querySelector('.circle-center');
        
        // Créer le wrapper
        const progressWrapper = document.createElement('div');
        progressWrapper.className = 'progress-wrapper';
        
        // Réorganiser les éléments (sans le compteur)
        this.progressContainer.remove();
        progressWrapper.appendChild(this.progressContainer);
        this.loadingScreen.appendChild(progressWrapper);
        
        // Animation du compteur avec des incréments variables
        let progress = 0;
        const interval = setInterval(() => {
            const increment = Math.floor(Math.random() * 5) + 1;
            progress = Math.min(100, progress + increment);
            centerText.textContent = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                    const introScreen = document.getElementById('introScreen');
                    introScreen.style.display = 'flex';
                    
                    // Ajouter les nombres flottants
                    this.createIntroFloatingNumbers();
                    
                    // Configuration de particles.js
                    particlesJS('particles-js', {
                        particles: {
                            number: { 
                                value: 180,
                                density: {
                                    enable: true,
                                    value_area: 800
                                }
                            },
                            color: { value: '#ffffff' },
                            shape: { type: 'circle' },
                            opacity: {
                                value: 0.5,
                                random: true,
                                anim: {
                                    enable: true,
                                    speed: 1,
                                    opacity_min: 0.1,
                                    sync: false
                                }
                            },
                            size: {
                                value: 3,
                                random: true,
                                anim: {
                                    enable: true,
                                    speed: 2,
                                    size_min: 0.1,
                                    sync: false
                                }
                            },
                            line_linked: {
                                enable: true,
                                distance: 120,
                                color: '#ffffff',
                                opacity: 0.3,
                                width: 1
                            },
                            move: {
                                enable: true,
                                speed: 1.5,
                                direction: 'none',
                                random: true,
                                straight: false,
                                out_mode: 'out',
                                bounce: false
                            }
                        },
                        interactivity: {
                            detect_on: 'canvas',
                            events: {
                                onhover: {
                                    enable: true,
                                    mode: 'grab'
                                },
                                onclick: {
                                    enable: true,
                                    mode: 'push'
                                },
                                resize: true
                            },
                            modes: {
                                grab: {
                                    distance: 140,
                                    line_linked: {
                                        opacity: 0.8
                                    }
                                }
                            }
                        },
                        retina_detect: true
                    });
                }, 500);
            }
        }, 100);
        
        this.progressBar.style.animation = 'loadProgress 5s ease-out forwards, gradientShift 2s linear infinite';
    }

    createFloatingNumbers() {
        const floatingNumbers = document.createElement('div');
        floatingNumbers.className = 'floating-numbers';
        this.loadingScreen.appendChild(floatingNumbers);

        const colors = ['#1593E6', '#0F72B3', '#0B598D', '#08436A'];
        
        for (let i = 0; i < 30; i++) {
            const number = document.createElement('div');
            number.className = 'number';
            number.textContent = Math.floor(Math.random() * 10);

            // Positions et animations aléatoires
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const endX = Math.random() * 100;
            const endY = Math.random() * 100;
            const duration = 3 + Math.random() * 4;
            const size = 20 + Math.random() * 40;
            const rotation = Math.random() * 360;
            const color = colors[Math.floor(Math.random() * colors.length)];

            number.style.setProperty('--startX', `${startX}vw`);
            number.style.setProperty('--startY', `${startY}vh`);
            number.style.setProperty('--endX', `${endX}vw`);
            number.style.setProperty('--endY', `${endY}vh`);
            number.style.setProperty('--duration', `${duration}s`);
            number.style.setProperty('--original-size', `${size}px`);
            number.style.setProperty('--size', `${size}px`);
            number.style.setProperty('--color', color);
            number.style.setProperty('--rotation', `${rotation}deg`);
            
            // Délai aléatoire pour le début de l'animation
            number.style.animationDelay = `${Math.random() * 2}s`;

            floatingNumbers.appendChild(number);
        }
    }

    createStars() {
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        this.loadingScreen.appendChild(starsContainer);

        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            const size = 1 + Math.random() * 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = 1 + Math.random() * 2;
            
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.setProperty('--twinkle-duration', `${duration}s`);
            star.style.animationDelay = `${Math.random() * 2}s`;
            
            starsContainer.appendChild(star);
        }
    }

    createNumberPad() {
        this.numberPad.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const btn = document.createElement('button');
            btn.className = 'number-btn';
            btn.style.backgroundImage = `url(assets/images/${i}_without.png)`;
            btn.addEventListener('mouseover', () => {
                btn.style.backgroundImage = `url(assets/images/${i}.png)`;
            });
            btn.addEventListener('mouseout', () => {
                btn.style.backgroundImage = `url(assets/images/${i}_without.png)`;
            });
            btn.addEventListener('click', () => this.getNumberChoose(i));
            this.numberPad.appendChild(btn);
        }
    }

    createCheckSlots() {
        this.numberChecks.innerHTML = '';
        this.checkResults.innerHTML = '';
        for (let i = 0; i < this.LEVEL_MAX; i++) {
            const checkSlot = document.createElement('div');
            checkSlot.className = 'check-slot';
            checkSlot.dataset.index = i;
            checkSlot.addEventListener('click', () => this.setNumber(i));
            if (i < this.level) {
                checkSlot.style.display = 'block';
            } else {
                checkSlot.style.display = 'none';
            }
            this.numberChecks.appendChild(checkSlot);

            const resultSlot = document.createElement('div');
            resultSlot.className = 'result-slot';
            resultSlot.dataset.index = i;
            resultSlot.style.display = 'none';
            this.checkResults.appendChild(resultSlot);
        }
    }

    getNumberChoose(num) {
        this.sounds.click.play();
        this.numberChoose = num;
    }

    setNumber(index) {
        if (this.numberChoose >= 0) {
            this.sounds.put.play();
            const checkSlots = document.querySelectorAll('.check-slot');
            checkSlots[index].style.backgroundImage = `url(assets/images/${this.numberChoose}.png)`;
            this.listNumber[index] = this.numberChoose;
        } else {
            this.sounds.error.play();
        }
    }

    checkFunction() {
        if (this.listNumber.includes(-1)) {
            this.sounds.error.play();
            alert("Veuillez remplir tous les chiffres.");
        } else {
            this.numberChoose = -1;
            this.endGameFunction();

            this.round += 1;
            this.levelInfo.textContent = `Level : ${this.level}, Round : ${this.round}`;

            // Cacher les numéros
            const numberBtns = document.querySelectorAll('.number-btn');
            numberBtns.forEach(btn => btn.style.display = 'none');

            this.checkButton.style.display = 'none';

            if (this.endGame && this.level < this.LEVEL_MAX) {
                this.sounds.success.play();
                this.endGameMessage.textContent = "Félicitations, passez au niveau suivant";
                this.endGameMessage.style.display = 'block';
                this.nextLevelButton.style.display = 'block';
            } else if (this.endGame && this.level >= this.LEVEL_MAX) {
                this.sounds.congratulation.play();
                this.endGameMessage.textContent = "Félicitations, vous avez gagné !";
                this.nextLevelButton.textContent = "Commencer une nouvelle partie";
                this.endGameMessage.style.display = 'block';
                this.nextLevelButton.style.display = 'block';
            } else {
                this.sounds.checkFalse.play();
                this.nextRoundButton.style.display = 'block';
                // Afficher les résultats
                for (let i = 0; i < this.level; i++) {
                    const resultSlot = document.querySelectorAll('.result-slot')[i];
                    if (this.listNumber[i] === this.listMainNumber[i]) {
                        resultSlot.style.backgroundImage = `url('assets/images/V.png')`;
                    } else if (this.listMainNumber.includes(this.listNumber[i])) {
                        resultSlot.style.backgroundImage = `url('assets/images/E.png')`;
                    } else {
                        resultSlot.style.backgroundImage = `url('assets/images/F.png')`;
                    }
                    resultSlot.style.display = 'block';
                }
            }
        }
    }

    endGameFunction() {
        this.endGame = this.listNumber.every((num, idx) => num === this.listMainNumber[idx]);
    }

    nextRoundFunction() {
        this.sounds.nextRound.play();
        this.listNumber = new Array(this.level).fill(-1);
        this.nextRoundButton.style.display = 'none';
        this.checkButton.style.display = 'block';
        // Réinitialiser les slots de résultats
        const resultSlots = document.querySelectorAll('.result-slot');
        resultSlots.forEach(slot => {
            slot.style.backgroundImage = '';
            slot.style.display = 'none';
        });
        // Réafficher les numéros
        const numberBtns = document.querySelectorAll('.number-btn');
        numberBtns.forEach(btn => btn.style.display = 'block');
    }

    nextLevel() {
        if (this.level === this.LEVEL_MAX) {
            this.level = 1;
        } else {
            this.level += 1;
        }
        this.round = 0;
        this.listMainNumber = Array.from({length: this.level}, () => Math.floor(Math.random() * 10));
        this.listNumber = new Array(this.level).fill(-1);
        this.endGame = false;

        this.levelInfo.textContent = `Level : ${this.level}, Round : ${this.round}`;
        this.endGameMessage.style.display = 'none';
        this.nextLevelButton.style.display = 'none';
        this.nextRoundButton.style.display = 'none';

        // Réinitialiser les slots de vérification
        const checkSlots = document.querySelectorAll('.check-slot');
        checkSlots.forEach((slot, index) => {
            if (index < this.level) {
                slot.style.display = 'block';
                slot.style.backgroundImage = `url('assets/images/White.png')`;
            } else {
                slot.style.display = 'none';
            }
        });

        // Réinitialiser les slots de résultats
        const resultSlots = document.querySelectorAll('.result-slot');
        resultSlots.forEach(slot => {
            slot.style.backgroundImage = '';
            slot.style.display = 'none';
        });

        // Réafficher les numéros
        const numberBtns = document.querySelectorAll('.number-btn');
        numberBtns.forEach(btn => btn.style.display = 'block');

        this.checkButton.style.display = 'block';
        this.sounds.nextLevel.play();
    }

    startGame() {
        this.sounds.startGame.play();
        this.gameTitle.style.fontSize = '30px';
        this.gameTitle.style.marginTop = '-70px';
        this.levelInfo.style.display = 'block';
        this.createCheckSlots();
        this.createNumberPad();
        this.startGameButton.style.display = 'none';
        this.checkButton.style.display = 'block';
    }

    showHelp() {
        this.sounds.help.play();
        this.helpModal.style.display = 'block';
    }

    closeHelp() {
        this.helpModal.style.display = 'none';
    }

    createIntroFloatingNumbers() {
        const floatingNumbers = document.createElement('div');
        floatingNumbers.className = 'floating-numbers';
        document.getElementById('introScreen').appendChild(floatingNumbers);

        const colors = ['#1593E6', '#4CAF50', '#FF3B3B', '#FFC107', '#9C27B0', '#FF9800'];
        
        for (let i = 0; i < 40; i++) {
            const number = document.createElement('div');
            number.className = 'number intro-number';
            number.textContent = Math.floor(Math.random() * 10);

            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const endX = Math.random() * 100;
            const endY = Math.random() * 100;
            const duration = 4 + Math.random() * 6;
            const size = 15 + Math.random() * 30;
            const rotation = Math.random() * 360;
            const color = colors[Math.floor(Math.random() * colors.length)];

            number.style.setProperty('--startX', `${startX}vw`);
            number.style.setProperty('--startY', `${startY}vh`);
            number.style.setProperty('--endX', `${endX}vw`);
            number.style.setProperty('--endY', `${endY}vh`);
            number.style.setProperty('--duration', `${duration}s`);
            number.style.setProperty('--size', `${size}px`);
            number.style.setProperty('--color', color);
            number.style.setProperty('--rotation', `${rotation}deg`);
            
            number.style.animationDelay = `${Math.random() * 3}s`;
            floatingNumbers.appendChild(number);
        }
    }
}

// Créer l'instance du jeu
const game = new Game();