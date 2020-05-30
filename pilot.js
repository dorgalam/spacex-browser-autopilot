

(function (){

    const shouldFixPositive = (rate, error, multiplier = 0.1) =>  {
        const errorIsPositive = error > 0;
        const fixIsPositive = rate >= 0;
        const fixRateIsTooSlow = Math.abs(rate) < (Math.abs(error) * multiplier); 

        return (errorIsPositive && fixRateIsTooSlow) || (!errorIsPositive && !fixRateIsTooSlow && !fixIsPositive);
    }
    const shouldFixNegative = (rate, error, multiplier = 0.1) =>  {
        const errorIsNegative = error < 0;
        const fixRateIsNegative = rate <= 0;
        const fixRateIsTooSlow = (Math.abs(rate) < (Math.abs(error) * multiplier)); 
    
        return (errorIsNegative && fixRateIsTooSlow) || (!errorIsNegative && !fixRateIsTooSlow && !fixRateIsNegative);
    }

    const fix = async (parameter, fixFunctionA, fixFunctionB) => {
        const getError = () => Number($(`#${parameter}`).children[0].innerText.replace('°', ''));
        const getRate =  () => Number($(`#${parameter}`).children[1].innerText.replace('°/s', ''));
        while (!stop) {
            const error = getError();
            const rate = getRate();

            if (shouldFixPositive(rate, error)) {
                fixFunctionA();
            } 
            if (shouldFixNegative(rate, error)) {
                fixFunctionB();
            }

            await (new Promise(resolve => setTimeout(resolve, 100)))
        }
    }

    const fixAxis = async (axis, fixFunctionA, fixFunctionB) => {
        const getDistance = () => Number($(`#${axis}-range`).children[0].innerText.replace('m', ''));

        const getSpeed = async () => {
            const distanceStart = getDistance();
            const now = new Date();
            await (new Promise(resolve => setTimeout(resolve, 200)));
            const done = new Date();
            const distanceStop = getDistance();
            return (distanceStart - distanceStop) / ((done - now) / 1000);
        }

        while (!stop) {
            const currentSpeed = await getSpeed();
            const distance = getDistance();
            if (shouldFixPositive(currentSpeed, distance)) {
                fixFunctionA();
            } 
            if (shouldFixNegative(currentSpeed, distance)) {
                fixFunctionB();
            }

        }
    }

    const fixSpeed = async () => {

        while (!stop) {
            const currentSpeed = Math.abs(Number($('#rate').children[1].innerText.replace('m/s', '')));
            const currentDistance = Number($(`#x-range`).children[0].innerText.replace('m', ''));

            if (currentDistance < 5 && currentSpeed < 0.1) return;

            if (currentDistance * 0.03 > currentSpeed) {
                translateForward();
            } else {
                translateBackward();
            }

            await (new Promise(resolve => setTimeout(resolve, 200)));

        }

    }

    fix('roll', rollRight, rollLeft);
    fix('pitch', pitchDown, pitchUp);
    fix('yaw', yawRight, yawLeft);
    fixSpeed();
    fixAxis('y', translateLeft, translateRight);
    fixAxis('z', translateDown, translateUp);

})()

