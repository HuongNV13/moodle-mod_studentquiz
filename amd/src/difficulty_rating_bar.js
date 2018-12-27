// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Javascript for processing difficulty and rating svg
 *
 * @package    mod_studentquiz
 * @copyright  2018 HSR (http://www.hsr.ch)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define(['jquery'], function($) {

    /** @type {string} Base path for Bolt element. */
    var BOLT_BASE = ',1.838819l3.59776,4.98423l-1.4835,0.58821l4.53027,4.2704l-1.48284,0.71317l5.60036,7.15099l-9.49921,' +
    '-5.48006l1.81184,-0.76102l-5.90211,-3.51003l2.11492,-1.08472l-6.23178,-3.68217l6.94429,-3.189z';
    /** @type {string} Base path for Star element. */
    var STAR_BASE = ',8.514401l5.348972,0l1.652874,-5.081501l1.652875,5.081501l5.348971,0l-4.327402,3.140505l1.652959,' +
        '5.081501l-4.327403,-3.14059l-4.327402,3.14059l1.65296,-5.081501l-4.327403,-3.140505z';

    /**
     * Create the given node.
     *
     * @param {string} n Element tag to create.
     * @param {object} v Attribute to create the element.
     * @returns {Element} Element created with given tag.
     */
    function getNode(n, v) {
        var element = document.createElementNS("http://www.w3.org/2000/svg", n);
        for (var p in v) {
            element.setAttributeNS(null, p.replace(/[A-Z]/g, function(m) {
                return '-' + m.toLowerCase();
            }), v[p]);
        }
        return element;
    }

    /**
     * Get the Bolt/Star path.
     *
     * @param {Element} svg Svg element.
     * @param {number} m Path value to draw.
     * @param {boolean} filled Fill with color or not.
     * @param {string} base Base value to create Bolt or Star path.
     */
    function getBoltOrStar(svg, m, filled, base) {
        var fillColor = '#ffc107';
        if (!filled) {
            fillColor = '#fff';
        }
        var r = getNode('path', {stroke: '#868e96', fill: fillColor, d: 'm' + m + base});
        svg.appendChild(r);
    }

    /**
     * Add the background to element.
     *
     * @param {Element} svg Svg element.
     * @param {number} level width of the background.
     */
    function addBackground(svg, level) {
        var r;
        r = getNode('rect', {
            x: 0.396847, y: 0.397703, rx: 5, ry: 5, width: 100, height: 20,
            'stroke-width': 0.5, fill: '#fff', stroke: '#868e96'
        });
        svg.appendChild(r);

        r = getNode('rect', {
            x: 0.396847, y: 0.397703, rx: 5, ry: 5, width: level, height: 20,
            'stroke-width': 0.5, fill: '#007bff', stroke: '#868e96'
        });
        svg.appendChild(r);
    }

    /**
     * Create Star bar.
     *
     * @param {number} mine My rating.
     * @param {number} average Average rating.
     * @returns {Element} Star bar element.
     */
    function createStarBar(mine, average) {
        var svg = getNode('svg', {width: 101, height: 21});
        var g = getNode('g', {});
        svg.appendChild(g);
        addBackground(g, average * 20);
        var stars = mine * 5;
        for (var i = 5; i <= 85; i = i + 20) {
            var makeStar = false;
            if (stars > 0) {
                makeStar = true;
            }
            getBoltOrStar(g, i, makeStar, STAR_BASE);
            stars = stars - 5;
        }
        return svg;
    }

    /**
     * Create Bolt bar.
     *
     * @param {number} mine My difficulty.
     * @param {number} average Average difficulty.
     * @returns {Element} Bolt bar element.
     */
    function createBoltBar(mine, average) {
        var svg = getNode('svg', {width: 101, height: 21});
        var g = getNode('g', {});
        svg.appendChild(g);
        addBackground(g, average * 100);
        var bolts = mine * 5;
        for (var i = 8; i <= 88; i = i + 20) {
            var makeBolt = false;
            if (bolts > 0) {
                makeBolt = true;
            }
            getBoltOrStar(g, i, makeBolt, BOLT_BASE);
            bolts = bolts - 1;
        }
        return svg;
    }


    return {
        /**
         * Initialise function.
         */
        initialise: function() {
            $(document).ready(function() {
                $('.mod_studentquiz_difficulty').each(function() {
                    var difficultyLevel = $(this).data('difficultylevel');
                    var myDifficulty = $(this).data('mydifficulty');
                    if (difficultyLevel === undefined && myDifficulty === undefined) {
                        $(this).append('n.a.');
                    } else {
                        if (difficultyLevel === undefined) {
                            difficultyLevel = 0;
                        }
                        if (myDifficulty === undefined) {
                            myDifficulty = 0;
                        }
                        $(this).append(createBoltBar(myDifficulty, difficultyLevel));
                    }
                });
                $('.mod_studentquiz_ratingbar').each(function() {
                    var rate = $(this).data('rate');
                    var myRate = $(this).data('myrate');
                    if (rate === undefined && myRate === undefined) {
                        $(this).append('n.a.');
                    } else {
                        if (rate === undefined) {
                            rate = 0;
                        }
                        if (myRate === undefined) {
                            myRate = 0;
                        }
                        $(this).append(createStarBar(myRate, rate));
                    }
                });
            });
        }
    };
});
