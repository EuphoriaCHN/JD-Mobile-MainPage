(function (window, undefined) {
    /**
     * 设置屏幕在滚动时 search 需要改变背景颜色
     */
    function setBannerScrollTransition() {
        let search = document.getElementsByClassName('jd-search')[0];
        let banner = document.getElementsByClassName('jd-banner')[0];

        let bannerHeight = banner.clientHeight;

        window.addEventListener('scroll', function () {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop <= bannerHeight) {
                let alpha = Math.min(1, scrollTop / bannerHeight);
                search.style.backgroundColor = `rgba(233, 35, 34, ${alpha})`;
            } else {
                // 防止滚得太快了来不及慢慢改变
                if (search.style.backgroundColor.startsWith('rgba')) {
                    search.style.backgroundColor = 'rgb(233, 35, 34)';
                }
            }
        });
    }

    /**
     * 秒杀倒计时效果
     */
    function secondKillCountdown() {
        let spans = document.getElementsByClassName('js-sk-timer');

        let deadLine = {
            'hour': 18,
            'minute': 30,
            'second': 22
        };

        let totalSeconds = deadLine.second + deadLine.minute * 60 + deadLine.hour * 3600;

        /**
         * 格式化秒数 => 小时, 分钟, 秒数
         * @param seconds 总秒数
         * @return {{hour: number, minute: number, second: number}}
         */
        function getDetailsTime(seconds) {
            let hour = Math.floor(seconds / 3600);
            let minute = Math.floor((seconds % 3600) / 60);
            let second = seconds % 60;
            return {hour, minute, second};
        }

        /**
         * 处理只有个位数的时间，给其补上前缀 0
         * @param time 格式化过的 {小时, 分钟, 秒数}
         */
        function formatTime(time) {
            time.hour = (time.hour > 9 ? '' : '0') + time.hour;
            time.minute = (time.minute > 9 ? '' : '0') + time.minute;
            time.second = (time.second > 9 ? '' : '0') + time.second;
        }

        /**
         * 设置 DOM 元素内容
         * @param time 格式化过的 {小时, 分钟, 秒数}
         */
        function setDOM(time) {
            spans[0].innerText = time.hour[0];
            spans[1].innerText = time.hour[1];
            spans[2].innerText = time.minute[0];
            spans[3].innerText = time.minute[1];
            spans[4].innerText = time.second[0];
            spans[5].innerText = time.second[1];
        }

        let detailsTime = getDetailsTime(totalSeconds);
        formatTime(detailsTime);
        setDOM(detailsTime);

        var timer = setInterval(function () {
            totalSeconds = Math.max(0, totalSeconds - 1);
            let detailsTime = getDetailsTime(totalSeconds);
            formatTime(detailsTime);
            setDOM(detailsTime);
            if (totalSeconds === 0) {
                clearInterval(timer);
            }
        }, 1000);
    }

    /**
     * 轮播图
     */
    function rotationChart() {
        // 因为图片都是动态获取的，现在假设已经将获取到的正确的图片添加到了 DOM 树中
        // 动态设置轮播图的页面结构
        let bannerImages = document.getElementsByClassName('jd-banner-img')[0];
        let firstListItem = bannerImages.firstElementChild;
        let lastListItem = bannerImages.lastElementChild;

        // 节流阀
        let isEnd = true;

        bannerImages.appendChild(firstListItem.cloneNode(true));
        bannerImages.insertBefore(lastListItem.cloneNode(true), firstListItem);
        bannerImages.style.left = -1 * firstListItem.clientWidth + 'px';

        let totalListItemsAfterInsert = bannerImages.children.length;
        bannerImages.style.width = totalListItemsAfterInsert * 100 + '%';

        for (let i = 0; i < bannerImages.children.length; i++) {
            bannerImages.children[i].style.width = 1 / totalListItemsAfterInsert * 100 + '%';
        }

        // 设置下方的小圆点
        let indicator = document.getElementsByClassName('jd-banner-indicator')[0];
        for (let i = 0; i < bannerImages.children.length - 2; i++) {
            let each = document.createElement('li');
            if (i === 0) {
                each.className = 'active';
            }
            indicator.appendChild(each);
        }
        let indicatorOldActive = indicator.children[0];

        function setIndicator(index) {
            indicatorOldActive.className = '';
            indicator.children[index].className = 'active';
            indicatorOldActive = indicator.children[index];
        }

        bannerImages.style.opacity = '1'; // 将图片显示出来
        setBannerScrollTransition(); // 等 banner 加载好了，再去初始化 layout 的滚动背景渐变

        // 初始化轮播图的偏移量
        let nowImageIndex = 1; // 这里应该是 1，因为前面又插了一张
        let offset = bannerImages.children[0].clientWidth; // 因为已经将左边的第一个给偏移过去了
        let nowOffsetLeft = offset;

        window.addEventListener('resize', function () {
            // 当屏幕被缩放时，应该重新设置 offset 和 nowOffsetLeft
            offset = bannerImages.children[0].clientWidth;
            nowOffsetLeft = nowImageIndex * offset;
            if (!(bannerImages.style.transition.startsWith('none'))) {
                bannerImages.style.transition = 'none';
            }
            bannerImages.style.left = -1 * nowOffsetLeft + 'px';
        });

        // 设置自动轮播
        let autoRotationTimer = undefined;

        function startInterval() {
            autoRotationTimer = setInterval(function () {
                nowImageIndex++;
                nowOffsetLeft += offset;

                if (bannerImages.style.transition !== '') {
                    bannerImages.style.transition = ''; // 取消行内过渡样式，采用设计好的 css 样式
                }

                bannerImages.style.left = -1 * nowOffsetLeft + 'px';
            }, 2000);
        }

        startInterval(); // 默认开始自动轮播

        // 手动轮播
        let startX, moveX, distanceX; // 因为轮播图只会横着走，设置开始触点、移动时的坐标和差值
        let beforeTouchLeft = 0; // 为记录总共移动距离做准备

        bannerImages.addEventListener('touchstart', function (ev) {
            clearInterval(autoRotationTimer);
            let e = ev || window.event;
            startX = e.targetTouches[0].clientX;

            bannerImages.style.transition = 'none';
            beforeTouchLeft = parseInt(bannerImages.style.left);
        });

        bannerImages.addEventListener('touchmove', function (ev) {
            if (isEnd) {
                let e = ev || window.event;
                moveX = e.targetTouches[0].clientX;
                distanceX = moveX - startX;

                // 偏移元素
                bannerImages.style.left = beforeTouchLeft + distanceX + 'px';
            }
        });

        bannerImages.addEventListener('touchend', function (ev) {
            // 计算总共移动的距离
            let afterTouchLeft = parseInt(bannerImages.style.left);
            let totalTouchLeft = beforeTouchLeft - afterTouchLeft;

            // 松开手指后，要将 isEnd 置为空，防止连着滑动
            isEnd = false;

            // bannerImages.style.transition = ''; // 去掉行内的样式，沿用 CSS 文件中写的过渡
            bannerImages.style.transition = 'left .3s ease-in-out';

            // 如果移动的距离超过了图片的 1 / 4，那么就是移动到下一张的意思
            if (Math.abs(totalTouchLeft) > offset / 4) {
                if (totalTouchLeft > 0) {
                    // 滑动到下一张
                    nowImageIndex++;
                } else {
                    // 滑动到上一张
                    nowImageIndex--;
                }
                nowOffsetLeft = nowImageIndex * offset;
                bannerImages.style.left = -1 * nowOffsetLeft + 'px';
            } else {
                // 返回回去
                bannerImages.style.left = beforeTouchLeft + 'px';
            }

            // 将上一次 move 所产生的所有数据都要重置
            startX = 0;
            moveX = 0;
            distanceX = 0;

            startInterval(); // 松手之后重新开始轮播
        });

        bannerImages.addEventListener('webkitTransitionEnd', function () {
            if (nowImageIndex === 0 || nowImageIndex === bannerImages.children.length - 1) {
                bannerImages.style.transition = 'none'; // 取消过渡效果
                if (nowImageIndex === bannerImages.children.length - 1) {
                    // 当前过渡到了最后一张
                    nowImageIndex = 1; // 应该跳转到第一(2)张
                } else if (nowImageIndex === 0) {
                    nowImageIndex = bannerImages.children.length - 2; // 应该跳转到倒数第二张
                }
                nowOffsetLeft = nowImageIndex * offset;
                bannerImages.style.left = -1 * nowOffsetLeft + 'px'; // 偷偷移动到对应的图片
            }
            setIndicator(nowImageIndex - 1);
            setTimeout(() => {
                isEnd = true;
            }, 300);
        });
    }

    window.addEventListener('load', function () {
        rotationChart();
        secondKillCountdown();
    });
})(window, undefined);
