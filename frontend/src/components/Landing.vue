<template>
  <div class="landing" style="height:100vh">
    <div>
      <b-carousel
        id="carousel-fade"
        style="text-shadow: 0px 0px 2px #000"
        fade
        indicators
        img-width="1024"
        img-height="480"
      >
        <b-carousel-slide
          caption="Vocab Training"
          img-src="https://picsum.photos/1024/480"
        ></b-carousel-slide>
        <b-carousel-slide
          caption="Customized Testing"
          img-src="https://picsum.photos/1020/470"
        ></b-carousel-slide>
        <b-carousel-slide
          caption="Dictionary Logging"
          img-src="https://picsum.photos/1010/460"
        ></b-carousel-slide>
      </b-carousel>
    </div>

    <br>

    <div align="center" class="d-block d-lg-none">

    <b-card header="Welcome" header-bg-variant="prime" header-text-variant="cream" header-tag="h3">
      <button class="buttonDiv  bg-warn text-cream" style="width:60%"  @click="$router.push('/login')"><b-icon-power></b-icon-power><span> &nbsp;Log In</span></button>
      <button class="buttonDiv mt-3 bg-info text-cream" style="width:60%"  @click="$router.push('/register')"><b-icon-person-fill></b-icon-person-fill><span> &nbsp;Join</span></button>
    </b-card>

    </div>

</div>

</template>

<script>

export default {
  name: 'Landing',
  props: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
