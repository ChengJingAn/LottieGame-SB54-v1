import React, { useEffect, useContext, useRef, useState } from 'react';
import "../../stylesheets/styles.css";
import BaseImage from '../../components/BaseImage';

import { UserContext } from '../../components/BaseShot';
import { prePathUrl, generateStandardNum } from "../../components/CommonFunctions"

let timerList = []
//-0.5,1.25,5,-5


export default function Review1({ _baseGeo, nextFunc }) {
    const audioList = useContext(UserContext)
    const starList = Array.from({ length: 50 }, ref => useRef())
    const baseRef = useRef()

    useEffect(
        () => {

            setTimeout(() => {
                starList.map((star, index) => {
                    setTimeout(() => {
                        star.current.className = 'show'
                    }, 100 * index);
                })
            }, 1500);

            setTimeout(() => {
                nextFunc()
            }, 10000);
            return () => {
            }
        }, []
    )

    return (
        <div ref={baseRef}
            className="aniObject"  >
            <div
                style={{
                    position: "fixed", width: _baseGeo.width + "px",
                    height: _baseGeo.height + "px"
                    , left: _baseGeo.left + _baseGeo.width * 0.0 + "px",
                    bottom: _baseGeo.bottom + _baseGeo.height * 0.0 + "px",
                }}>
                <BaseImage
                    scale={0.2}
                    className={'upDownAni'}
                    style={{ opacity: 0.7 }}
                    posInfo={{
                        l: 0.4,
                        b: 0.4
                    }}
                    url={'SB54_Prop-Interactive/PI_Space_ship_02.svg'}
                />


                {
                    Array.from(Array(50).keys()).map(value =>
                        <div
                            ref={starList[value]}
                            className='hide'
                            style={{
                                position: 'absolute',
                                width: '7%',
                                height: '11%',
                                left: (0.13 + (value % 10) * 0.075) * 100 + '%',
                                top: (0.1 + 0.17 * parseInt((value / 10))) * 100 + '%',
                            }}>

                            < BaseImage
                                url={'SB54_Prop-Interactive/PI_big_Star_01.svg'}
                            />
                            < BaseImage
                                scale={0.65}
                                posInfo={{
                                    l: 0.18
                                    , t: value > 4 ? 0.26 : 0.2
                                }}
                                url={'SB54_Text-Interactive/TI_G2_' + generateStandardNum((value + 1) * 2) + '_1.svg'}
                            />
                        </div>
                    )
                }


            </div>
        </div>
    );

}
