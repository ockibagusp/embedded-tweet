<script setup></script>

<script>
export default {
  data() {
    return {
      // textarea: embeddedTweet
      embeddedTweet: "",

      // tweet dihasil maks. 280 karakter
      count: 280,

      tweetSuccess: "",

      // pilih strong: '*Tweet ini tidak ada hasil'
      selectNoResult: false,

      // pilih button salinan dan tweet: true atau false
      selectCopy: false,
      selectTweet: false,
    };
  },
  mounted() {
    this.$refs.embeddedTweet.focus();
  },
  computed: {
    // adalah salinan dan tweet: true atau false
    isCopy: function () {
      return !this.selectCopy;
    },
    isTweet: function () {
      return !this.selectTweet;
    },
  },
  created() {},
  watch: {
    // textarea: embeddedTweet
    embeddedTweet() {
      // vue methods: memuat
      this.carry();
    },
  },
  methods: {
    // memuat: dari textarea embeddedTweet ini
    async carry() {
      if (this.embeddedTweet == "") {
        this.embeddedTweet = "";
        this.isEmbeddedTweetDefault();
        return;
      }

      let embeddedTweetArray = this.embeddedTweet.toString().split(" ");
      console.log("embeddedTweetArray:", embeddedTweetArray);
      let quit = false;
      for (let i = 0; i < embeddedTweetArray.length; i++) {
        const embeddedTweet = embeddedTweetArray[i];
        console.log(">>>", embeddedTweet);
        const twitterChars = embeddedTweet.search(
          /https:\/\/(twitter|x)\.com\//
        );

        console.log("# embeddedTweet:", embeddedTweet);
        console.log("this.tweetSuccess:", this.tweetSuccess);
        console.log(
          "embeddedTweet.search",
          embeddedTweet.search(this.tweetSuccess)
        );
        // ?
        let videoChars = "";
        if (this.tweetSuccess !== "") {
          console.log("if (this.tweetSuccess !==");
          videoChars = this.tweetSuccess;
        } else console.log("else");
        videoChars = embeddedTweet.search(/\/video\/1$/);

        console.log("twitterChars:", twitterChars);
        console.log("videoChars:", videoChars);

        let anythingButTwitter,
          realTwitter = "";

        if (twitterChars !== -1) {
          quit = true;
          if (videoChars !== -1) {
            this.selectCopy = true;
            this.selectTweet = true;
            this.count = 280 - this.embeddedTweet.length;
            break;
          }

          if (twitterChars !== 0) {
            anythingButTwitter = embeddedTweet.slice(0, twitterChars - 1);
          }
          realTwitter = embeddedTweet.slice(twitterChars, embeddedTweet.length);
          console.log("realTwitter:", realTwitter);

          // regex101.com
          const regex =
            /https:\/\/(twitter|x)\.com\/(\w.*)\/status\/(\d*)|\?\w.*/gm;

          let m;
          let profile,
            status = "";

          while ((m = regex.exec(realTwitter)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
              regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
              if (match !== undefined && groupIndex === 2) {
                profile = match;
              }

              if (match !== undefined && groupIndex === 3) {
                status = match;
              }
            });
          }

          console.log("profile:", profile);
          console.log("status:", status);

          if (profile != "" && status != "") {
            this.tweetSuccess = `https://twitter.com/${profile}/status/${status}/video/1`;
            console.log("i:", i);
            if (anythingButTwitter !== undefined) {
              anythingButTwitter = anythingButTwitter.trimEnd();
              embeddedTweetArray[
                i
              ] = `${anythingButTwitter}\n\n${this.tweetSuccess}`;
            } else {
              embeddedTweetArray[i] = this.tweetSuccess;
            }

            this.selectCopy = true;
            this.selectTweet = true;
          } else {
            this.selectCopy = false;
            this.selectTweet = false;

            this.count = 280 - this.embeddedTweet.length;
            break;
          }

          console.log("embeddedTweetArray:", embeddedTweetArray);

          this.embeddedTweet = embeddedTweetArray.join(" ");
          break;
        } else {
          this.embeddedTweet = embeddedTweetArray.join(" ");
        }

        this.count = 280 - this.embeddedTweet.length;
      }

      if (!quit) {
        this.isEmbeddedTweetError();
        this.count = 280 - this.embeddedTweet.length;
        return;
      }
    },

    // button: reset, copy dan tweet
    btnReset() {
      this.embeddedTweet = "";
      this.$refs.embeddedTweet.focus();
      this.tweetSuccess = "";
      this.selectCopy = false;
      this.selectTweet = false;
    },

    btnCopy() {
      if (this.embeddedTweet == "" || this.embeddedTweet == "Tidak ada hasil") {
        return;
      }

      this.$refs.embeddedTweet.select();
      // Untuk perangkat seluler
      this.$refs.embeddedTweet.setSelectionRange(0, 99999);

      navigator.clipboard.writeText(this.embeddedTweet);
    },

    btnTweet() {
      if (this.embeddedTweet.length > 280) {
        this.selectTweet = false;
        return;
      }
      const UTF8_hash = this.embeddedTweet.replaceAll("#", "%23");
      window.open(
        "https://twitter.com/intent/tweet?text=" + UTF8_hash,
        "_blank"
      );
    },

    btnCopyExample() {
      navigator.clipboard.writeText(
        "Fedora 37! 👏\n\nhttps://twitter.com/ockibagusp/status/1592924571732414465?s=20&t=bgO6hwTfDckbtQibxDJZPQ"
      );
      this.$refs.embeddedTweet.focus();
    },

    isNotEmbeddedTweet() {
      this.embeddedTweet = "";
      this.isEmbeddedTweetDefault();
    },

    isEmbeddedTweetError() {
      this.isEmbeddedTweetDefault();
    },

    isEmbeddedTweetDefault() {
      // this.embeddedTweetBool = false
      this.count = 280;
      this.selectCopy = false;
      this.selectTweet = false;
    },

    isEmbeddedTweetSuccess(videoLength) {
      this.selectCopy = true;
      this.selectTweet = true;
      this.count = 280 - videoLength;
    },
  },
};
</script>

<template>
  <main>
    <h2 style="margin-top: 5px">
      Menyematkan (embed) Tweet Video Tanpa Me-Retweet di Twitter
    </h2>
    <p style="margin-top: -15px">
      Link:
      <a
        href="https://www.howtogeek.com/668753/how-to-embed-someones-twitter-video-without-retweeting-them"
        target="_blank"
        >How to Embed Someone’s Twitter Video Without Retweeting Them!</a
      >
    </p>
    <textarea
      v-model="embeddedTweet"
      style="margin-top: -10px; width: 500px; height: 90px"
      placeholder="Fedora 37! 👏

https://twitter.com/ockibagusp/status/1592924571732414465?s=20&t=bgO6hwTfDckbtQibxDJZPQ"
      cols="50"
      rows="4"
      ref="embeddedTweet"
      data-test="embedded-tweet"
    ></textarea>
    <br />
    <button @click="btnReset" data-test="btn-reset">Reset</button>
    <button @click="btnCopy" data-test="btn-copy" :disabled="isCopy">
      Copy
    </button>
    <button @click="btnTweet" data-test="btn-tweet" :disabled="isTweet">
      Tweet is: <small v-if="embeddedTweet.length < 280">+</small> {{ count }}
    </button>
    👏
    https://x.com/ockibagusp/status/1592924571732414465?s=20&t=bgO6hwTfDckbtQibxDJZPQ
    <strong
      v-if="selectNoResult"
      data-test="str-no-result"
      :style="{ 'margin-left': '10px', color: selectNoResult ? 'red' : '' }"
      >*Tweet ini tidak ada hasil</strong
    >
    <br />
    <p style="color: green; margin-top: 12px; margin-bottom: 8px">
      *Bagikan Video Twitter di Android dan Video Twitter Dari Web
    </p>
    <div style="width: 700px">
      <p style="margin-bottom: 0px">Contoh:</p>
      <p style="margin-top: 1px; border-bottom: 1px solid black">
        https://twitter.com/ockibagusp/status/1592924571732414465?s=20&t=bgO6hwTfDckbtQibxDJZPQ
        <button @click="btnCopyExample">Copy</button>
      </p>
    </div>
  </main>
</template>
