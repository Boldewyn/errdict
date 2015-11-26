---
layout: default
footer: >
  <a href="https://github.com/Boldewyn/errdict">Add an entry on Github</a> /
  <a href="https://twitter.com/m_strehl">by @m_strehl</a>
description: >
  A comprehensive collection of error codes in human-to-human e-mail
  communication.
---

## {{ site.title }}

<figure>
  <img src="images/icon128.png" alt="stylized envelope struck by lightning" height="128" width="128">
</figure>

# Index of Error Codes

1. [ERR_CALL_TIME](ERR_CALL_TIME)
1. [ERR_INSUFFICIENT_INPUT](ERR_INSUFFICIENT_INPUT)
1. [ERR_J](ERR_J)
1. [ERR_MISSING_RETURN](ERR_MISSING_RETURN)
1. [ERR_NEGATION](ERR_NEGATION)
1. [ERR_NO_FILE](ERR_NO_FILE)
1. [ERR_PARSE_FAILURE](ERR_PARSE_FAILURE)
1. [ERR_PREMATURE](ERR_PREMATURE)
1. [ERR_TIMEOUT](ERR_TIMEOUT)

This dictionary presents a comprehensive collection of error codes in
human-to-human e-mail communication. If you find an error code missing, please
see the [contribution guide](CONTRIBUTING).

<script>
document
  .querySelectorAll('ol')[0]
    .addEventListener('click', function(evt) {
      if (evt.target.nodeName === 'LI') {
        evt.target.getElementsByTagName('a')[0].click();
      }
    });
</script>
