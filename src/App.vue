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
    carry() {
      let newEmbeddedTweet = ''

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
    
    // button: copy dan tweet
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
      navigator.clipboard.writeText('https://twitter.com/ockibagusp/status/1592924571732414465?s=20&t=bgO6hwTfDckbtQibxDJZPQ')
    },
  }
}
</script>

<template>
  <main>
    <h2 style="margin-top: 5px;">Menyematkan (embed) Video Tweet Tanpa Me-Retweet di Twitter</h2>
    <p style="margin-top: -15px;">Link: <a href="https://www.howtogeek.com/668753/how-to-embed-someones-twitter-video-without-retweeting-them" target="_blank">How to Embed Someone’s Twitter Video Without Retweeting Them!</a></p>
    <textarea v-model="embeddedTweet" placeholder="https://twitter.com/ockibagusp/status/1592924571732414465?s=20&t=bgO6hwTfDckbtQibxDJZPQ" cols="50" rows="3" ref="embeddedTweet" style="margin-top: -10px;"></textarea>
    <br>
    <button @click="btnCopy" :disabled="isCopy">Copy</button>
    <button @click="btnTweet" :disabled="isTweet">Tweet is: <small v-if="embeddedTweet.length < 280">+</small> {{count}}</button>
    <br>
    <p style="color: green">*Bagikan Video Twitter di Android dan Video Twitter Dari Web</p>
    <p>Contoh: https://twitter.com/ockibagusp/status/1592924571732414465?s=20&t=bgO6hwTfDckbtQibxDJZPQ <button @click="btnCopyExample">Copy</button></p>

  </main>
  </template>

