<template>
  <scroll-view
    ref="scrollView"
    class="scroll-view"
    scroll-x="true"
    :scroll-left="scrollLeft"
    id="scroll-id"
  >
    <view class="scroll-container">
      <view class="item-no-pet" v-if="list.length === 0">
        <view class="no-pet-title">记录与毛孩子的美好瞬间</view>
        <view class="no-pet-add-bg" @click="handleAddPet">
          <image
            class="no-pet-add-img"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/home/home_pet_add.png"
          ></image>
          <view class="no-pet-add-title">添加爱宠</view>
        </view>
      </view>
      <view
        class="item"
        v-for="(item, index) in list"
        :key="index"
        v-if="list.length"
        :style="{
          width: list.length > 1 ? '542rpx' : 'calc(100vw - 210rpx)',
          marginLeft: index > 0 ? '0' : '15rpx',
          backgroundColor:
            list[index].id == getCurPetId
              ? 'rgba(255, 212, 30, 0.6)'
              : 'rgba(255, 255, 255, 0.6)',
        }"
        @click="handleEditPet(item)"
        :id="`scroll-item-${index}`"
      >
        <image
          mode="aspectFill"
          class="pet-avatar"
          :src="item.avatarUrl"
          @click="clickPet(item)"
        ></image>
        <view class="pet-info" @click="clickPet(item)">
          <view class="pet-name-edit">
            <view class="pet-name">{{ item.nickName.slice(0, 7) }}</view>
            <view
              class="edit"
              v-if="pageName == 'petRecords'"
              @click="handleEdit(item)"
            ></view>
          </view>
          <view class="pet-desc"
            >{{ item.categoryName }} | {{ item.guardTime }} |
            {{ item.sexName == "MM" ? "妹妹" : "弟弟" }}</view
          >
        </view>
      </view>
      <view class="pet-add-item" v-if="list.length" @click="handleAddPet">
        <view>
          <view class="pet-add-img-bg">
            <image
              class="pet-add-img"
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/home/home_pet_add.png"
            ></image>
          </view>
          <view class="pet-add-title">添加</view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>
<script>
import { mapState } from "vuex";

export default {
  components: {},
  props: {
    list: {
      type: Array,
      default: [],
    },
    pageName: {
      type: String,
      default: "",
    },
    petId: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      curAddress: "",
      curShopName: "",
      noLocalTips: "",
      noStoreList: null,
      scrollLeft: 0,
      curPetId: this.petId,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    getCurPetId () {
      return this.curPetId || this.petId;
    },
  },
  async mounted () {
    if (this.pageName == "petRecords") {
      setTimeout(async () => {
        // console.log("created 1111 ", this.list, this.petId);
        let _index = this.list.findIndex((item) => item.id == this.petId);
        // console.log("created 1111 ", _index);
        const query = uni.createSelectorQuery().in(this);
        let ret = await this.getSelectorQueryRect(
          query,
          `#scroll-item-${_index}`,
          true
        );
        console.log("created11 res111 ret11  ", ret);
        this.scrollLeft = ret[0].left - 10;
      }, 200);
    }

    return;
  },
  created () { },
  methods: {
    handleAddPet () {
      if (!this.userInfo.token) {
        uni.navigateTo({
          url: "/pagesD/login/index",
        });
        return;
      }

      if (this.pageName == "") {
        uni.navigateTo({
          url: "/pagesD/petInfo/index?type=taskdesc&transparentTopBar=1",
        });
      } else {
        uni.redirectTo({
          url: `/pagesD/petInfo/index?type=taskdesc&enterType=petRecordAdd&transparentTopBar=1`,
        });
      }
    },
    handleEditPet (info) { },

    getSelectorQueryRect (query, selector, all = false) {
      return new Promise((resolve, reject) => {
        if (all) {
          query
            .selectAll(selector)
            .boundingClientRect((rects) => {
              resolve(rects);
            })
            .exec();
        } else {
          query
            .select(selector)
            .boundingClientRect((rect) => {
              resolve(rect);
            })
            .exec();
        }
      });
    },

    async clickPet (item) {
      // console.log("item : ", item, this.pageName);
      if (this.pageName == "") {
        uni.navigateTo({
          url: `/pagesE/petRecords/index?petId=${item.id}`,
        });
      } else {
        this.curPetId = item.id;
        // console.log("this.curPetId : ", this.curPetId);
        this.$emit("select", item);
      }
    },
    handleEdit (item) {
      uni.redirectTo({
        url: `/pagesD/editPetProfile/index?petId=${item.id}&type=edit&enterType=petRecord`,
      });
    },
  },
  watch: {
    list (newVal, oldVal) { },
  },
};
</script>

<style scoped lang="scss">
@mixin pet-background {
  height: 135rpx;
  background-color: rgba($color: #ffffff, $alpha: 0.6);
  display: inline-flex;
  margin: 25rpx 15rpx;
  align-items: center;
  justify-content: center;
  border-radius: 23rpx;
  vertical-align: top;
}

.scroll-view {
  white-space: nowrap;
  width: 100%;

  .item-no-pet {
    @include pet-background;
    margin: 25rpx 25rpx 25rpx 25rpx;
    width: calc(100vw - 50rpx);

    .no-pet-title {
      font-size: 35rpx;
      font-weight: 600;
      color: #1f1f1f;
      line-height: 48rpx;
      flex: 1;
      margin-left: 40rpx;
    }

    .no-pet-add-bg {
      width: 165rpx;
      height: 60rpx;
      border-radius: 30rpx;
      background: white;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-right: 28rpx;

      .no-pet-add-img {
        width: 27rpx;
        height: 27rpx;
      }

      .no-pet-add-title {
        font-size: 23rpx;
        font-weight: 500;
        color: #1f1f1f;
        line-height: 31rpx;
      }
    }
  }

  .item {
    @include pet-background;

    .pet-avatar {
      width: 108rpx;
      height: 108rpx;
      border-radius: 54rpx;
      margin-left: 15rpx;
      object-fit: contain;
    }

    .pet-info {
      flex: 1;
      margin-left: 23rpx;
      margin-right: 10rpx;
      min-width: 0;

      .pet-name-edit {
        display: flex;
        justify-content: start;
        align-items: center;

        .pet-name {
          font-size: 42rpx;
          font-weight: 600;
          color: #1f1f1f;
          line-height: 58rpx;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .edit {
          width: 31rpx;
          height: 31rpx;
          background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/petRecords/edit.png");
          background-size: cover;
          margin-left: 10rpx;
          padding-right: 30rpx;
        }
      }

      .pet-desc {
        font-size: 25rpx;
        font-weight: 400;
        color: #1f1f1f;
        line-height: 35rpx;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .pet-add-item {
    width: 135rpx;
    @include pet-background;
    margin-left: 0;

    .pet-add-img-bg {
      width: 54rpx;
      height: 54rpx;
      border-radius: 27rpx;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;

      .pet-add-img {
        width: 27rpx;
        height: 27rpx;
      }
    }

    .pet-add-title {
      font-size: 23rpx;
      font-weight: 400;
      color: #1f1f1f;
      text-align: center;
      margin-top: 7rpx;
    }
  }
}
</style>
