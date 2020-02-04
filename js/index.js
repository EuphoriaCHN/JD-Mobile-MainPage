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

    window.addEventListener('load', function () {
        setBannerScrollTransition();
        secondKillCountdown();
    });
})(window, undefined);
