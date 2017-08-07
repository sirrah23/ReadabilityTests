#!/usr/bin/env node

const rita = require('rita');

function count_syllables(word){
    return rita.getSyllables(word).split('/').length;
}

function text_metadata(text){
    const sentences = rita.splitSentences(text);
    const total_sentences = sentences.length;
    const total_words = sentences.reduce((num_words, sentence) => {
        return num_words + sentence.split(' ').length
    }, 0);
    const total_syllables = sentences.reduce((num_syllables, sentence) => {
        return num_syllables + sentence.split(' ').reduce((num_syllables, word) => {
            return num_syllables + count_syllables(word);
        }, 0);
    }, 0);
    return {total_sentences, total_words, total_syllables}
}

function reading_ease({total_sentences, total_words, total_syllables}){
    return 206.835 - 1.015 * (total_words/total_sentences) - 84.6 * (total_syllables/total_words);
}

function grade_level({total_sentences, total_words, total_syllables}){
    return 0.39 * (total_words/total_sentences) + 11.8 * (total_syllables/total_words) - 15.59;
}

const brownfox_metadata = text_metadata("The quick brown fox jumped over the lazy dog.")
console.log("Reading ease is " + reading_ease(brownfox_metadata));
console.log("Grade level is " + grade_level(brownfox_metadata));
