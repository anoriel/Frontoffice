<template>
  <v-avatar :title="getTitle()" :style="getColor('radial')" size="small">
    <v-icon v-if="itemId === 0" style="color: white; font-size: 16px; margin: -2px">
      mdi-asterisk
    </v-icon>
    <span v-else>
      {{ getNom() }}
    </span>
  </v-avatar>
</template>

<script>
import tinycolor from 'tinycolor2'
import useCommonHelper from '../helpers/commonHelper'

const helpers = useCommonHelper()

export default {
  name: 'UserCircle',
  props: {
    prenom: {
      type: String,
      required: false,
      default: 'pas de prénom',
    },
    nom: {
      type: String,
      required: false,
      default: 'pas de prénom',
    },
    itemId: {
      type: Number,
      required: false,
      default: null,
    },
  },
  methods: {
    getNom() {
      let value = '#N/A'
      if (this.itemId == 0) {
        value = '*' //this.capitalizeFirstLetter(this.$t("all"));
      }
      if (this.prenom.length && this.nom.length) {
        value = this.prenom.charAt(0).toUpperCase() + this.nom.charAt(0).toUpperCase()
      }
      return value
    },
    getTitle() {
      return this.nom + ' ' + this.prenom
    },
    getColor(gradient = 'none') {
      let threshold = 0.27
      let ciphertext = this.nom + ' ' + this.prenom
      if (this.itemId == 0 || this.itemId == -1) {
        ciphertext = this.itemId
      }
      let primaryColor = tinycolor(helpers.getHexColor(ciphertext))
      if (primaryColor.getLuminance() > threshold) {
        primaryColor.darken(10)
      } else if (primaryColor.getLuminance() < 0.05) {
        primaryColor.lighten(20)
      }
      let primaryColorHexa = primaryColor.toString()
      let textColor =
        primaryColor.clone().darken(10).getLuminance() > threshold ? '#000000' : '#FFFFFF'

      let firstColor = tinycolor(primaryColorHexa).lighten(50).toString()
      let thirdColor = tinycolor(primaryColorHexa).darken(50).toString()

      let css = 'color: ' + textColor + '; '
      if (gradient == 'none') {
        css += 'background: ' + primaryColorHexa
      } else if (gradient == 'linear') {
        css +=
          'background: ' +
          primaryColorHexa +
          '; background: -moz-linear-gradient(135deg, ' +
          firstColor +
          ' 0%, ' +
          primaryColorHexa +
          ' 35%, ' +
          thirdColor +
          ' 100%); background: -webkit-linear-gradient(135deg, ' +
          firstColor +
          ' 0%, ' +
          primaryColorHexa +
          ' 35%, ' +
          thirdColor +
          ' 100%); background: linear-gradient(135deg, ' +
          firstColor +
          ' 0%, ' +
          primaryColorHexa +
          ' 35%, ' +
          thirdColor +
          ' 100%); filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="' +
          firstColor +
          '",endColorstr="' +
          primaryColorHexa +
          '",GradientType=1);'
      } else if (gradient == 'radial') {
        css +=
          'background: ' +
          primaryColorHexa +
          '; background: -moz-radial-gradient(circle at right top, ' +
          firstColor +
          ' 0%, ' +
          primaryColorHexa +
          ' 35%, ' +
          thirdColor +
          ' 100%); background: -webkit-radial-gradient(circle at right top, ' +
          firstColor +
          ' 0%, ' +
          primaryColorHexa +
          ' 35%, ' +
          thirdColor +
          ' 100%); background: radial-gradient(circle at right top, ' +
          firstColor +
          ' 0%, ' +
          primaryColorHexa +
          ' 35%, ' +
          thirdColor +
          ' 100%); filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#' +
          primaryColorHexa +
          '",endColorstr="#' +
          firstColor +
          '",GradientType=1);'
      }

      return css
    },
  },
}
</script>
