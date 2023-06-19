<script setup>
</script>

<script>
export default {
  data() {
    return {
      // textarea: embeddedTweet
      embeddedTweet: '',

      // tweet dihasil maks. 280 karakter
      count: 280,
      
      // pilih button salinan dan tweet: true atau false
      selectCopy: false,
      selectTweet: false
    }
  },
  mounted() {
    this.$refs.embeddedTweet.focus()
  },
  computed: {
    // adalah salinan dan tweet: true atau false
    isCopy: function() {
      return !this.selectCopy
    },
    isTweet: function() {
      return !this.selectTweet
    }
  },
  created() {
    
  },
  watch: {
    // textarea: embeddedTweet
    embeddedTweet() {
      // vue methods: memuat
      this.carry()
    }
  },
  methods: {
    // memuat: dari textarea embeddedTweet ini
    async carry() {
      let newEmbeddedTweet = ''

      if (this.embeddedTweet == '') {
        this.embeddedTweet = ''
        this.isEmbeddedTweetDefault()
        return
      }

      // regex101.com
      const regex = /https:\/\/twitter\.com\/(\w.*)\/status\/(\d*)|\?\w.*/gm

      const oldEmbeddedTweet = this.embeddedTweet
      
      let m
      let profile, status = ''

      while ((m = regex.exec(oldEmbeddedTweet)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }
        
        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          if (match !== undefined && groupIndex === 1) {
            profile = match
          }

          if (match !== undefined && groupIndex === 2) {
            status = match
          }
        })
      }

      console.log('profile:', profile);
      console.log('status:', status);

      if (profile != '' && status != '') {
        newEmbeddedTweet = `https://twitter.com/${profile}/status/${status}/video/1`
        this.selectResults = true
        this.selectCopy = true
        this.selectTweet = true

        this.count = 280 - newEmbeddedTweet.length
      } else {
        newEmbeddedTweet = this.embeddedTweet
        this.selectResults = false
        this.selectCopy = false
        this.selectTweet = false

        this.count = 280
      }
      
      this.embeddedTweet = newEmbeddedTweet
    },

    // button: reset, copy dan tweet
    btnReset() {
      this.embeddedTweet == ''
      this.$refs.embeddedTweet.focus()
      this.selectCopy = false
      this.selectTweet = false
    },
    
    btnCopy() {
      if (this.embeddedTweet == '' || this.embeddedTweet == 'Tidak ada hasil') {
        return
      }
      
      this.$refs.embeddedTweet.select()
      // Untuk perangkat seluler
      this.$refs.embeddedTweet.setSelectionRange(0, 99999)
    
      navigator.clipboard.writeText(this.embeddedTweet)
    },

    btnTweet() {
      if (this.embeddedTweet.length > 280) {
        this.selectTweet = false
        return
      }
      const UTF8_hash = this.embeddedTweet.replaceAll("#", "%23")
      window.open("https://twitter.com/intent/tweet?text="+UTF8_hash, "_blank")
    },

    btnCopyExample() {
      navigator.clipboard.writeText('Fedora 37! 👏\n\nhttps://twitter.com/ockibagusp/status/1592924571732414465?s=20&t=bgO6hwTfDckbtQibxDJZPQ')
    },

    isNotEmbeddedTweet() {
      this.embeddedTweet = ''
      this.isEmbeddedTweetDefault()
    },
    isEmbeddedTweetDefault() {
      // this.embeddedTweetBool = false
      this.count = 280
      this.selectCopy = false
      this.selectTweet = false
    },
    isEmbeddedTweetSuccess(videoLength) {
      // this.embeddedTweetBool = true
      this.selectResults = true
      this.selectCopy = true
      this.selectTweet = true
      this.count = 280 - videoLength
    }
  }
}
</script>

<template>
  <main>
    <h2 style="margin-top: 5px;">Menyematkan (embed) Video Tweet Tanpa Me-Retweet di Twitter</h2>
    <p style="margin-top: -15px;">Link: <a href="https://www.howtogeek.com/668753/how-to-embed-someones-twitter-video-without-retweeting-them" target="_blank">How to Embed Someone’s Twitter Video Without Retweeting Them!</a></p>
    <textarea v-model="embeddedTweet" style="margin-top: -10px; width: 500px;height: 90px;" 
      placeholder="Fedora 37! 👏 (2)

https://twitter.com/ockibagusp/status/1592924571732414465?s=20&t=bgO6hwTfDckbtQibxDJZPQ" cols="50" rows="4" ref="embeddedTweet" data-test="embedded-tweet"></textarea>
    <br>
    <button @click="btnReset" data-test="btn-reset">Reset</button>
    <button @click="btnCopy" data-test="btn-copy" :disabled="isCopy">Copy</button>
    <button @click="btnTweet" data-test="btn-tweet" :disabled="isTweet">Tweet is: <small v-if="embeddedTweet.length < 280">+</small> {{count}}</button>
    <strong style="margin-left: 10px; color: red;">*Tweet ini tidak ada hasil</strong>
    <br>
    <p style="color: green; margin-top: 8px; margin-bottom: 8px;">*Bagikan Video Twitter di Android dan Video Twitter Dari Web</p>
    <p style="margin-bottom: 5px;">Contoh:</p>
    <p style="margin-top: 5px;">Fedora 37! 👏 (2)</p>  
    <p>https://twitter.com/ockibagusp/status/1592924571732414465?s=20&t=bgO6hwTfDckbtQibxDJZPQ <button @click="btnCopyExample">Copy</button></p>
  </main>
  </template>

