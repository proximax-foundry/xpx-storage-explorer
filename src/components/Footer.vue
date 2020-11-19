<template>
  <footer class="footer">
    <div class="columns my-2">
      <div class="column col-mr-auto text-left">
        <div class="btn-group">
          <a href="https://proximax.io" target="_blank">
            <img src="@/assets/logo.svg" class="img-responsive" width="50"/>
          </a>
          <a class="btn btn-link text-dark text-dark h4" href="https://www.proximax.io/en/wallet" target="_blank">Wallet</a>
          <a class="btn btn-link text-dark text-dark h4" href="https://www.proximax.io/en/xpx" target="_blank">XPX</a>
          <a class="btn btn-link text-dark text-dark h4" href="https://www.proximax.io/en/#faqs" target="_blank">FAQs</a>
          <a class="btn btn-link text-dark text-dark h4" href="https://www.proximax.io/en/#support" target="_blank">Contact</a>
        </div>
      </div>
      <div class="column col-ml-auto text-right mb-2">
        <a class="btn btn-link text-dark" @click="scrollToTop">Back to top <i class="icon icon-arrow-up ml-2"></i></a>
      </div>
    </div>
    <hr />
    <div class="columns my-2">
      <div class="column col-mr-auto text-left">
        <div class="text-bold text-small">
          Copyright &copy; {{ thisYear }}. ProximaX <sup>&reg;</sup>. All rights reserved.
        </div>
        <a class="btn btn-link text-bold text-small" href="https://www.proximax.io/en/terms-of-use" target="_blank">Terms of Use</a>
        <a class="btn btn-link text-bold text-small" href="https://www.proximax.io/en/privacy" target="_blank">Privacy Policy</a>
        <a class="btn btn-link text-bold text-small" href="https://www.proximax.io/en/cookies" target="_blank">Cookie Policy</a>
      </div> 
      <div class="column col-ml-auto text-right mt-2">
        <a class="btn btn-link text-dark s-circle" href="http://t.me/ProximaXio" target="_blank"><FontAwesomeIcon :icon="['fab', 'telegram']" size="lg" /></a>
        <a class="btn btn-link text-dark s-circle" href="https://twitter.com/ProximaXio" target="_blank"><FontAwesomeIcon :icon="['fab', 'twitter']" size="lg" /></a>
        <a class="btn btn-link text-dark s-circle" href="https://github.com/proximax-foundry" target="_blank"><FontAwesomeIcon :icon="['fab', 'github']" size="lg" /></a>
        <a class="btn btn-link text-dark s-circle" href="https://www.instagram.com/proximaxio" target="_blank"><FontAwesomeIcon :icon="['fab', 'instagram']" size="lg" /></a>
        <a class="btn btn-link text-dark s-circle" href="https://www.reddit.com/r/ProximaXOfficial" target="_blank"><FontAwesomeIcon :icon="['fab', 'reddit']" size="lg" /></a>
        <a class="btn btn-link text-dark s-circle" href="https://www.facebook.com/ProximaXio" target="_blank"><FontAwesomeIcon :icon="['fab', 'facebook']" size="lg" /></a>
        <a class="btn btn-link text-dark s-circle" href="https://medium.com/@proximaxio" target="_blank"><FontAwesomeIcon :icon="['fab', 'medium']" size="lg" /></a>
        <a class="btn btn-link text-dark s-circle" href="https://www.youtube.com/channel/UCky9HP0VlqsnGQWrbMPFVnw" target="_blank"><FontAwesomeIcon :icon="['fab', 'youtube']" size="lg" /></a>
        <a class="btn btn-link text-dark s-circle" href="https://www.linkedin.com/company/proximaxio" target="_blank"><FontAwesomeIcon :icon="['fab', 'linkedin']" size="lg" /></a>
        <a class="btn btn-link text-dark s-circle" href="https://blockfolio.com/coin/XPX" target="_blank"><FontAwesomeIcon :icon="['fab', 'btc']" size="lg" /></a>
      </div>
    </div>
  </footer>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTelegram, faTwitter, faGithub, faInstagram, faReddit, faFacebook, faMedium, faYoutube, faLinkedin, faBtc } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed } from "vue";

library.add(faTelegram, faTwitter, faGithub, faInstagram, faReddit, faFacebook, faMedium, faYoutube, faLinkedin, faBtc);

export default {
  components: {
    FontAwesomeIcon,
  },
  inject: ["siriusStore"],
  setup() {
    const thisYear = computed(() => new Date().getFullYear());

    const scrollToTop = () => {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    };

    return {
      scrollToTop,
      thisYear,
    };
  },
};
</script>
