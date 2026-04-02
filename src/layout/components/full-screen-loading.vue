<script setup lang="ts">

</script>

<template>
  <div class="pos-absolute bottom-0 left-0 right-0 top-0 z-10 size-full flex-center flex-1 overflow-hidden bg-layout">
    <div class="loading-container">
      <div class="loading">
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
      <h3>加载中...</h3>
    </div>
  </div>
</template>

<style  lang="scss">
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  animation: scale .2s 1 ease-in-out;
  font-size: 16px;

  .loading {
    display: block;
    height: 20px;
    width: 125px;

    div {
      display: inline-block;
      float: none;
      border: 0 solid currentColor;
      box-sizing: border-box;
      background: linear-gradient(#6675ff, 30%, #574cf5);
      white-space: nowrap;
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 100%;
      animation: ball-running-dots-animate 2s linear infinite;

      &:nth-child(1) {
        animation-delay: 0s;
      }

      &:nth-child(2) {
        animation-delay: -0.4s;
      }

      &:nth-child(3) {
        animation-delay: -0.8s;
      }

      &:nth-child(4) {
        animation-delay: -1.2s;
      }

      &:nth-child(5) {
        animation-delay: -1.6s;
      }
    }

  }
}

@keyframes ball-running-dots-animate {
  0%,
  100% {
    transform: translateY(0) translateX(500%);
  }

  80% {
    transform: translateY(0) translateX(0);
  }

  85% {
    transform: translateY(-125%) translateX(0);
  }

  95% {
    transform: translateY(-100%) translateX(500%);
  }
}

@keyframes scale {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
