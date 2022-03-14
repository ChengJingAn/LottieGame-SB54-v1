import React, { useContext, useState, useEffect, useRef } from 'react';
import "../../stylesheets/styles.css";

import { UserContext } from '../../components/BaseShot';
import { prePathUrl, initialAudio, startRepeatAudio } from '../../components/CommonFunctions';
import GamePanel from "./GamePanel"
import Review from "./Review"
import loadSound from "../../utils/loadSound"

var isGameStarted = false;
var timerList = []

const BaseScene = React.forwardRef(({ nextFunc, _geo, _baseGeo, showMusicBtn }, ref) => {

    const audioList = useContext(UserContext)
    const [isIntroHide, setIntroHide] = useState(false)
    const [isGameFinished, setGameFinish] = useState(false)
    const [isGameRenderStart, setGameRenderStart] = useState(false)

    const playBtnRef = useRef();
    const gamePanelRef = useRef();

    useEffect(() => {

        audioList.titleAudio =  loadSound('SB_54_Audio_01_A');
        audioList.bodyAudio = loadSound('SB_54_Audio_02');
        audioList.subBodyAudio = loadSound('SB_54_Audio_05');

        setTimeout(() => {
            playBtnRef.current.className = 'introText'
            setGameRenderStart(true)
            audioList.titleAudio.play();
        }, 1500);

        setTimeout(() => {
            playBtnRef.current.className = 'commonButton'
            playBtnRef.current.style.pointerEvents = ''
        }, 3000);


        playBtnRef.current.className = 'hide'
        return () => {

        }
    }, [])

    function finishGame() {
        gamePanelRef.current.style.display = 'none'
        setGameFinish(true)

        setGameRenderStart(false)
    }

    function clickFunc() {

        audioList.titleAudio.pause();
        audioList.titleAudio.currentTime = 0;
        showMusicBtn()

        if (!isGameStarted)
            new initialAudio(audioList)

        if (!isGameStarted) {
            setTimeout(() => {
                isGameStarted = true;
            }, 500);
        }

        setTimeout(() => {
            audioList.backAudio.play().catch(error => {
            });

            gamePanelRef.current.style.display = 'inline-block'
            gamePanelRef.current.style.transition = '1s'
            gamePanelRef.current.style.opacity = 1

            setTimeout(() => {
                timerList[0] = setTimeout(() => {
                    audioList.bodyAudio.play();
                    timerList[1] = setTimeout(() => {
                        audioList.subBodyAudio.play();
                        startRepeatAudio();
                    }, audioList.bodyAudio.duration * 1000 + 1000);
                }, 1000);
                setIntroHide(true)
            }, 1000);
        }, 200);
    }

    function stopSound() {

        timerList.map(timer => {
            clearTimeout(timer)
        })

        audioList.bodyAudio.pause();
        audioList.subBodyAudio.pause();

        audioList.bodyAudio.src = loadSound('SB_54_Audio_10')
    }
    return (
        <div>
            {!isIntroHide &&
                <div >

                    <div
                        style={{
                            position: "fixed", width: _geo.width * 0.5 + "px",
                            left: _geo.width * 0.65 + _geo.left + "px"
                            , bottom: _geo.height * -0.1 + _geo.top + "px",
                        }}>
                        <img draggable={false} width={"100%"}
                            src={prePathUrl() + 'images/SB54_Intro BG/SB_54_Intro_Game_1_PI_01.svg'}
                        />
                    </div>

                    <div
                        style={{
                            position: "fixed", width: _geo.width * 0.3 + "px",
                            left: _geo.width * 0.7 + _geo.left + "px"
                            , bottom: _geo.height * 0.2 + _geo.top + "px",
                        }}>
                        <img draggable={false} width={"100%"}
                            src={prePathUrl() + 'images/SB54_Intro BG/SB_54_Intro_Game_1_CH_01.svg'}
                        />
                    </div>

                    <div
                        style={{
                            position: "fixed", width: _geo.width * 0.6 + "px",
                            left: _geo.width * 0.5 + _geo.left + "px"
                            , bottom: _geo.height * 0.05 + _geo.top + "px",
                        }}>
                        <img draggable={false} width={"100%"}
                            src={prePathUrl() + 'images/SB54_Intro BG/SB_54_Intro_Game_PI_02.svg'}
                        />
                    </div>

                    <div
                        className='introText'
                        style={{
                            position: "fixed", width: _geo.width * 0.6 + "px",
                            left: _geo.width * 0.07 + _geo.left + "px"
                            , bottom: _geo.height * 0.3 + _geo.top + "px",
                        }}>
                        <img draggable={false} width={"100%"}
                            src={prePathUrl() + 'images/SB54_Intro BG/SB_54_Intro_Game_1_TI_01.svg'}
                        />
                    </div>

                    <div
                        className="hide"
                        ref={playBtnRef}
                        onClick={clickFunc}
                        style={{
                            position: "fixed", width: _geo.width * 0.12 + "px",
                            left: _geo.width * 0.3 + _geo.left + "px"
                            , bottom: _geo.height * 0.1 + _geo.top + "px",
                            cursor: "pointer",
                            pointerEvents: 'none'
                        }}>
                        <img draggable={false}
                            width={"100%"}
                            src={prePathUrl() + 'images/Buttons/Play_blue.svg'}
                        />
                    </div>
                </div>
            }
            {
                isGameRenderStart &&
                < div
                    ref={gamePanelRef}
                    style={{ display: 'none', opacity: 0 }}
                >
                    <GamePanel finishGame={finishGame} stopSound={stopSound} _baseGeo={_baseGeo} _geo={_geo} />
                </div>
            }

            {
                isGameFinished &&
                <Review nextFunc={nextFunc} _baseGeo={_baseGeo} _geo={_geo} />
            }
        </div >
    );
});

export default BaseScene;
