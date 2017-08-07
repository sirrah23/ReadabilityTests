#!/usr/bin/env node

const fs = require('fs');
const rita = require('rita');
const minimist = require('minimist');

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
    return {total_sentences, total_words, total_syllables};
}

function compute_reading_ease({total_sentences, total_words, total_syllables}){
    return 206.835 - 1.015 * (total_words/total_sentences) - 84.6 * (total_syllables/total_words);
}

function compute_grade_level({total_sentences, total_words, total_syllables}){
    return 0.39 * (total_words/total_sentences) + 11.8 * (total_syllables/total_words) - 15.59;
}

function main(filename){
    const filecontent = fs.readFileSync(filename).toString();
    const filecontent_metadata = text_metadata(filecontent);
    const reading_ease = compute_reading_ease(filecontent_metadata)
    const grade_level = compute_grade_level(filecontent_metadata);
    console.log({reading_ease, grade_level});
}

const argv = minimist(process.argv.slice(2));
main(argv.filename);
