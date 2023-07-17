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

      tweetSuccess: '',

      // pilih strong: '*Tweet ini tidak ada hasil'
      selectNoResult: false,
      
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
      if (this.embeddedTweet == '') {
        this.embeddedTweet = ''
        this.isEmbeddedTweetDefault()
        return
      }

      let embeddedTweetArray = this.embeddedTweet.toString().split(' '), 
        anythingButTwitter, realTwitter = ''
      let realTwitterArray = []
      let twitterChars = 0
      let quit = false
      let z = 0

      const regex = /https:\/\/twitter\.com\/(\w.*)\/status\/(\d*)|\?\w.*/gm
      for (let i = 0; i < embeddedTweetArray.length; i++) {
        const embeddedTweet = embeddedTweetArray[i]

        realTwitterArray = embeddedTweet.match(regex)
        console.log('realTwitterArray:', realTwitterArray);
        
        if (realTwitterArray !== null) {
          twitterChars = embeddedTweet.search(regex)
          console.log('o:', twitterChars);
          if (realTwitterArray[0].substring(0, 20) === 'https://twitter.com/') {
            realTwitter = realTwitterArray[0] + '/video/1'
            this.tweetSuccess = realTwitter
            quit = true
            
            z = i
            console.log('*ok');
          }

          if (twitterChars !== 0) {
            anythingButTwitter = embeddedTweet.slice(0, twitterChars-1)
          }
          realTwitter = embeddedTweet.slice(twitterChars, embeddedTweet.length)
        }  
      }

      if (realTwitter === '') {
        this.selectCopy = false
        this.selectTweet = false
        this.count = 280 - this.embeddedTweet.length
        return
      }

      /**
       * else: realTwitter !== ''
       *  
       * eq.
       * realTwitter = 'https://twitter.com/ockibagusp/status/1592924571732414465/video/1'
       */
      this.selectCopy = true
      this.selectTweet = true
      this.count = 280 - this.embeddedTweet.length

      if (anythingButTwitter !== undefined) {
        anythingButTwitter = anythingButTwitter.trimEnd()
        embeddedTweetArray[z] = `${anythingButTwitter}\n\n${this.tweetSuccess}`
      } else {
        embeddedTweetArray[z] = this.tweetSuccess
      }

      this.selectCopy = true
      this.selectTweet = true

      console.log('embeddedTweetArray:', embeddedTweetArray)
      this.embeddedTweet = embeddedTweetArray.join(' ')

      this.count = 280 - this.embeddedTweet.length
      
      if (!quit) {
        this.isEmbeddedTweetError()
        this.count = 280 - this.embeddedTweet.length
        return
      }
    },

    // button: reset, copy dan tweet
    btnReset() {
      this.embeddedTweet = ''
      this.$refs.embeddedTweet.focus()
      this.tweetSuccess = ''
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
      this.$refs.embeddedTweet.focus()
    },

    isNotEmbeddedTweet() {
      this.embeddedTweet = ''
      this.isEmbeddedTweetDefault()
    },
    
    isEmbeddedTweetError() {
      this.isEmbeddedTweetDefault()
    },

    isEmbeddedTweetDefault() {
      // this.embeddedTweetBool = false
      this.count = 280
      this.selectCopy = false
      this.selectTweet = false
    },

    isEmbeddedTweetSuccess(videoLength) {
      this.selectCopy = true
      this.selectTweet = true
      this.count = 280 - videoLength
    }
  }
}
</script>

<template>
  <main>
    <h2 style="margin-top: 5px;">Menyematkan (embed) Tweet Video Tanpa Me-Retweet di Twitter</h2>
    <p style="margin-top: -15px;">Link: <a href="https://www.howtogeek.com/668753/how-to-embed-someones-twitter-video-without-retweeting-them" target="_blank">How to Embed Someone’s Twitter Video Without Retweeting Them!</a></p>
    <textarea v-model="embeddedTweet" style="margin-top: -10px; width: 500px;height: 90px;" 
      placeholder="Fedora 37! 👏

https://twitter.com/ockibagusp/status/1592924571732414465?s=20&t=bgO6hwTfDckbtQibxDJZPQ" cols="50" rows="4" ref="embeddedTweet" data-test="embedded-tweet"></textarea>
    <br>
    <button @click="btnReset" data-test="btn-reset">Reset</button>
    <button @click="btnCopy" data-test="btn-copy" :disabled="isCopy">Copy</button>
    <button @click="btnTweet" data-test="btn-tweet" :disabled="isTweet">Tweet is: <small v-if="embeddedTweet.length < 280">+</small> {{count}}</button>
    <strong v-if="selectNoResult" data-test="str-no-result" :style="{'margin-left': '10px', color: selectNoResult ? 'red' : '' }">*Tweet ini tidak ada hasil</strong>
    <br>
    <p style="color: green; margin-top: 12px; margin-bottom: 8px;">*Bagikan Video Twitter di Android dan Video Twitter Dari Web</p>
    <div style="width: 700px;">
      <p style="margin-bottom: 0px;">Contoh:</p>
      <p style="margin-top: 1px; border-bottom:1px solid black;">https://twitter.com/ockibagusp/status/1592924571732414465?s=20&t=bgO6hwTfDckbtQibxDJZPQ <button @click="btnCopyExample">Copy</button></p>
    </div>
  </main>
  </template>

