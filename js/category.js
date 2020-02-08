((window, undefined) => {
    window.addEventListener('load', function () {
        // 获取左侧栏
        let ctLeft = document.querySelector('.ct-c-left');

        // 获取左侧栏的高度
        let ctLeftHeight = ctLeft.offsetHeight;

        // 获取用来滑动的列表
        let ulBox = ctLeft.querySelector('ul:first-of-type');

        // 获取 UL 的高度
        let ulBoxHeight = ulBox.offsetHeight;

        // 设置静止时上限 top 值
        let maxTop = 0;
        let minTop = ctLeftHeight - ulBoxHeight;
        // 设置滑动时上限 top 值
        let maxBounceTop = maxTop + 100;
        let minBounceTop = minTop - 100;

        // 实现滑动
        let startY = 0;
        let moveY = 0;
        let distanceY = 0;
        let currentY = 0;

        // 添加滑动事件
        ulBox.addEventListener('touchstart', function (ev) {
            let e = ev || window.event;
            // 获取手指的起始坐标
            startY = e.targetTouches[0].clientY;
        });
        ulBox.addEventListener('touchmove', function (ev) {
            let e = ev || window.event;
            moveY = e.targetTouches[0].clientY;
            // 计算距离差异
            distanceY = moveY - startY;
            // 判断是否超出当前指定的滑动区间
            if (currentY + distanceY > maxBounceTop || currentY + distanceY < minBounceTop) {
                return;
            }
            // 清除原先的过渡
            ulBox.style.transition = 'none';
            // 实现偏移操作
            ulBox.style.top = distanceY + currentY + 'px';
        });
        ulBox.addEventListener('touchend', function () {
            // 判断当前滑动的距离是否在静止状态的 top 值之间
            if (currentY + distanceY < minTop) {
                // 回到 minTop
                ulBox.style.transition = 'top .5s';
                ulBox.style.top = minTop + 'px';
                currentY = minTop;
            } else {
                if (currentY + distanceY > maxTop) {
                    ulBox.style.transition = 'top .5s';
                    ulBox.style.top = maxTop + 'px';
                    currentY = maxTop;
                } else {
                    currentY += distanceY;
                }
            }
        });
    });
})(window, undefined);
