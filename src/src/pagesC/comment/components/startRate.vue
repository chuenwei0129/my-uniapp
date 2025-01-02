<template>
	<view class="star-container" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
  @click="handleStarClick">
		<view  v-for="(star, index) in totalStars" :key="index" class="star-wrapper">
			<view class="star" :data-index="index"
				:class="{ 'full': index + 1 <= rating, 'empty': index + 1 > rating }">
			</view>
		</view>
	</view>
</template>

<script>
	export default {
    props:{
      value:{
        type:Number,
        default:0
      },
      totalStars: {
				type: Number,
				default: 5
			},
      readOnly:{
        default:false,
      }
    },
		data() {
			return {
				rating: 0,
				startX: 0,
				lastRating: 0 // 用于存储滑动前的评分
			};
		},
		methods: {
			handleTouchStart(event) {
        if(this.readOnly)return
				this.startX = event.touches[0].clientX;
				this.lastRating = this.value; // 存储滑动前的评分
			},
			handleTouchMove(event) {
        if(this.readOnly)return
				let offset = event.touches[0].clientX - this.startX;
				let rating = this.lastRating + offset / 41;
				if (rating < 0) rating = 0;
				if (rating > this.totalStars) rating = this.totalStars;
				this.rating = Math.ceil(rating);
        // this.$emit('input',this.rating)
			},
			handleTouchEnd(event) {
        if(this.readOnly)return
        this.$emit('input',this.rating)
			},
			handleStarClick(event) {
        if(this.readOnly)return
				const starIndex = event.target.dataset.index;
				if (starIndex !== undefined) {
					const index = parseInt(starIndex);
					if (index + 1 === this.rating) {
						this.$emit('input',index)
					} else {
            this.$emit('input',index+1)
					}
				}
			}
		},
    watch:{
      value:{
        handler(){
          console.log(this.value);
          this.rating = Number(this.value) || 0
        },
        immediate:true
      }
    }
	};
</script>

<style scoped>
	.star-container {
		display: flex;
	}
	
	.star-wrapper {
    width: 80rpx;
    height: 80rpx;
	}
  
	.star {
		width: 70rpx;
    height: 70rpx;
		background-image: url('https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/evaluate_start.png');
		background-size: cover;
	}

	.full {
		background-image: url('https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/evaluate_activeStart.png');
	}

</style>
