import React, { useEffect, useContext, useRef, useState } from 'react';
import "../../stylesheets/styles.css";
import BaseImage from '../../components/BaseImage';

import { UserContext } from '../../components/BaseShot';
import { prePathUrl, generateStandardNum , startRepeatAudio, setRepeatAudio, stopRepeatAudio } from "../../components/CommonFunctions"

let timerList = []
//-0.5,1.25,5,-5

const stepRange = 0.04

let isGameStarted = false;
let currentNum = 0;
let stepNumRange = 2;
let currentStep = 0

export default function Scene2({ finishGame, _baseGeo, stopSound }) {
    const audioList = useContext(UserContext)

    const baseRef = useRef()
    const backRef = useRef()
    const greenStar = useRef();
    const redStar = useRef();

    const layoutStartPos = { x: -5, y: -0.5 }
    const translateStartPos = { x: 5, y: -0.5 }

    const spaceEmpty = useRef();
    const spaceShip = useRef();

    const characterBase = useRef();
    const characterList = Array.from({ length: 2 }, ref => useRef())
    const starList = Array.from({ length: 100 }, ref => useRef())
    const starBaseList = Array.from({ length: 100 }, ref => useRef())
    const numberList = Array.from({ length: 100 }, ref => useRef())

    // width : + -> -
    // height : - ->+

    const upStairList = [
        0.00, 0.1, 0.25, 0.4,
        0.6, 0.8,
        1.1, 1.3,
        1.55, 1.75, 1.75
    ]

    const heightList = [
        0, -1, -2, -3, -2, -1, 0, 1, 0, -1,
        1, 2, 3, 4, 5, 6, 5, 4, 5, 6,
        7, 8, 9, 10, 9, 8, 7, 8, 9, 10,
        9, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 18, 17, 16, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25, 24, 23, 24,

        25, 26, 27, 28, 29, 30, 31, 32, 33, 32,
        31, 32, 33, 34, 35, 36, 35, 34, 35, 36,
        37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
        47, 48, 47, 46, 45, 44, 45, 46, 47, 48,

    ]
    const widthStep = 0.647

    useEffect(
        () => {

            setRepeatAudio(audioList.repeatAudio)
            isGameStarted = true;

            greenStar.current.style.opacity = 0
            redStar.current.style.opacity = 0

            characterList[1].current.setClass('hideObject')

            backRef.current.style.transition = '0s'
            backRef.current.style.transform = 'translate(' + (_baseGeo.width * (5 - currentStep * widthStep)) + 'px, '
                + _baseGeo.height * (-0.5 + upStairList[currentStep]) + 'px)'


            return () => {
                isGameStarted = false;
                currentNum = 0;
                currentStep = 0

                audioList.clapAudio.pause();
                audioList.clapAudio.currentTime = 0;
            }
        }, []
    )

    if (isGameStarted)
        reRenderingFunc()

    function reRenderingFunc() {
        backRef.current.style.transition = '0s'
        backRef.current.style.transform = 'translate(' + (_baseGeo.width * (5 - currentStep * widthStep)) + 'px, '
            + _baseGeo.height * (-0.5 + upStairList[currentStep]) + 'px)'


        characterList[0].current.setPosInfo({
            l: layoutStartPos.x + 0.017 + 0.065 * currentNum,
            b: layoutStartPos.y + 0.256 + 0.04 * heightList[currentNum - 1]
        })

        characterList[1].current.setPosInfo({
            l: layoutStartPos.x + 0.017 + 0.065 * currentNum + 0.06,
            b: layoutStartPos.y + 0.256 + 0.04 * heightList[currentNum]
        })

    }

    function clickFunc(num) {

        stopRepeatAudio();
        if (currentNum == 0)
            stopSound();
        if (num >= currentNum) {

            let currentStar = starBaseList[num]
            currentStar.current.style.transition = '0.1s'
            currentStar.current.style.transform = 'scale(0.9)'
            setTimeout(() => {
                currentStar.current.style.transform = 'scale(1)'
            }, 100);

            if (num + 1 == currentNum + stepNumRange) {

                audioList.buzzAudio.pause();
                audioList.tingAudio.currentTime = 0;
                audioList.tingAudio.play();

                baseRef.current.style.pointerEvents = 'none'
                starBaseList[currentNum].current.style.cursor = 'default'
                starBaseList[currentNum + 1].current.style.cursor = 'default'

                currentNum += stepNumRange;

                showButtonAni(greenStar, num)
                redStar.current.style.opacity = 0

                setTimeout(() => {
                    characterList[0].current.setClass('hideObject')
                    characterList[1].current.setClass('showObject')
                    setTimeout(() => {

                        characterList[0].current.setPosInfo({
                            l: layoutStartPos.x + 0.017 + 0.065 * currentNum,
                            b: layoutStartPos.y + 0.256 + 0.04 * heightList[currentNum - 1]
                        })
                        characterList[1].current.setClass('hideObject')

                        characterList[1].current.setPosInfo({
                            l: layoutStartPos.x + 0.017 + 0.065 * currentNum + 0.06,
                            b: layoutStartPos.y + 0.256 + 0.04 * heightList[currentNum]
                        })

                        characterList[0].current.setClass('showObject')

                        if (currentNum % 10 == 0) {

                            currentStep++;

                            backRef.current.style.transition = '2s'
                            backRef.current.style.transform = 'translate(' + (_baseGeo.width * (5 - currentStep * widthStep)) + 'px, '
                                + _baseGeo.height * (-0.5 + upStairList[currentStep]) + 'px)'



                            setTimeout(() => {
                                greenStar.current.style.opacity = 0

                                for (let i = currentNum - 10; i < currentNum; i++) {
                                    starList[i].current.setUrl('SB54_Prop-Interactive/PI_big_Star_Inactivate_01.svg')
                                    numberList[i].current.setStyle({ opacity: 0.4 })
                                    starBaseList[i].current.style.cursor = 'default'
                                }
                                baseRef.current.style.pointerEvents = ''
                                if (currentStep == 10) {

                                    characterList[0].current.setClass('hideObject')
                                    spaceEmpty.current.setClass('hideObject')
                                    spaceShip.current.setClass('upDownAni')

                                    audioList.bodyAudio.play();
                                    audioList.clapAudio.play();

                                    setTimeout(() => {
                                        spaceShip.current.setClass('movingRight')

                                        setTimeout(() => {
                                            spaceShip.current.setStyle({
                                                transform: 'translateX(' + _baseGeo.width * 1 + 'px)'
                                            })
                                        }, 500);
                                    }, 1500);

                                    setTimeout(() => {
                                        baseRef.current.style.transition = '0.7s'
                                        baseRef.current.style.opacity = 0
                                        setTimeout(() => {
                                            finishGame();
                                        }, 700);
                                    }, 5000);
                                }
                                else{
                                    startRepeatAudio();
                                }

                            }, 2000);

                        }
                        else {
                            startRepeatAudio();
                            baseRef.current.style.pointerEvents = ''
                        }


                    }, 200);
                }, 200);

            }

            else {
                audioList.tingAudio.pause();

                audioList.buzzAudio.currentTime = 0;
                audioList.buzzAudio.play();

                showButtonAni(redStar, num)
                greenStar.current.style.opacity = 0;
                startRepeatAudio();
            }
        }
    }

    function showButtonAni(obj, num) {
        obj.current.style.transition = '0.0s'
        obj.current.style.opacity = '0'
        obj.current.style.bottom = (layoutStartPos.y + 0.305 + heightList[num] * stepRange) * 100 + '%'
        obj.current.style.left = (layoutStartPos.x + 0.177 + num * 0.065) * 100 + '%'

        setTimeout(() => {
            obj.current.style.transition = '0.5s'
            obj.current.style.opacity = 1
        }, 100);
    }





    return (
        <div ref={baseRef}
            className="aniObject"  >
            <div
                ref={backRef}
                style={{
                    position: "fixed", width: _baseGeo.width + "px",
                    height: _baseGeo.height + "px"
                    , left: _baseGeo.left + _baseGeo.width * 0.0 + "px",
                    bottom: _baseGeo.bottom + _baseGeo.height * 0.0 + "px",
                }}>
                <img
                    style={{
                        width: '100%',
                        left: '0%', bottom: '0%',
                        transform: 'scale(11)'
                    }}
                    src={prePathUrl() + "images/SB54_BG/SB_54_Space_bg-01.svg"}
                />
                <BaseImage
                    scale={0.7}
                    posInfo={{ l: (layoutStartPos.x - 0.42), b: (layoutStartPos.y - 0.12) }}
                    url={'SB54_Intro BG/SB_54_Intro_Game_1_PI_01.svg'}
                />
                {
                    Array.from(Array(100).keys()).map(value =>
                        <div
                            ref={starBaseList[value]}
                            onClick={() => { clickFunc(value) }}
                            style={{
                                position: 'absolute',
                                width: '7%',
                                height: '11%',
                                cursor: 'pointer',
                                bottom: (layoutStartPos.y + 0.3 + heightList[value] * stepRange) * 100 + '%',
                                left: (layoutStartPos.x + 0.18 + value * 0.065) * 100 + '%'
                            }}>
                            < BaseImage
                                ref={starList[value]}
                                url={'SB54_Prop-Interactive/PI_big_Star_01.svg'}
                            />
                            < BaseImage
                                ref={numberList[value]}
                                scale={0.65}
                                posInfo={{ l: 0.18, t: value > 9 ? 0.26 : 0.2 }}
                                // style={{ opacity: 0.5 }}
                                url={'SB54_Text-Interactive/TI_G2_' + generateStandardNum(value + 1) + '_1.svg'}
                            />
                        </div>
                    )
                }

                <div
                    ref={greenStar}
                    style={{
                        position: 'absolute',
                        width: '7.5%',
                        height: '11%',
                        pointerEvents: 'none',
                        bottom: (layoutStartPos.y + 0.305 + heightList[2] * stepRange) * 100 + '%',
                        left: (layoutStartPos.x + 0.177 + 0.065 * 2) * 100 + '%'
                    }}>
                    < BaseImage
                        url={'SB54_Prop-Interactive/PI_big_Star_green_HL_01.svg'}
                    />
                </div>

                <div
                    ref={redStar}
                    style={{
                        position: 'absolute',
                        width: '7.5%',
                        height: '11%',
                        pointerEvents: 'none',
                        bottom: (layoutStartPos.y + 0.305 + heightList[0] * stepRange) * 100 + '%',
                        left: (layoutStartPos.x + 0.177) * 100 + '%'
                    }}>
                    < BaseImage
                        url={'SB54_Prop-Interactive/PI_big_Star_Red_HL_01.svg'}
                    />
                </div>
                <BaseImage
                    scale={0.2}
                    ref={spaceEmpty}
                    className={'upDownAni'}
                    posInfo={{
                        l: layoutStartPos.x + 0.017 + 6.68,
                        b: layoutStartPos.y + 0.296 + 1.85
                    }}
                    url={'SB54_Prop-Interactive/PI_Space_ship_02.svg'}
                />
                <BaseImage
                    ref={spaceShip}
                    scale={0.22}
                    className={'hideObject'}
                    posInfo={{
                        l: layoutStartPos.x + 0.017 + 6.67,
                        b: layoutStartPos.y + 0.296 + 1.835
                    }}
                    url={'SB54_Prop-Interactive/SB54_Spaceship_01.svg'}
                />



                {Array.from(Array(2).keys()).map(value =>
                    <BaseImage
                        ref={characterList[value]}
                        scale={0.65}

                        posInfo={{
                            l: layoutStartPos.x + 0.017 + [0, 0.06][value],
                            b: layoutStartPos.y + 0.296 + [0, -0.04][value]
                        }}
                        url={'SB54_Animation/alien/SB_54_CI_Alien_0' + [1, 2][value] + '.svg'}
                    />
                )}
            </div>
        </div>
    );

}
