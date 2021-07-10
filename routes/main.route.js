"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.baseRoute = void 0;
var Router = require("express");
var const_1 = require("./const");
var baseRoute = Router();
exports.baseRoute = baseRoute;
var createNewEntry = function (word) {
    const_1.statka.set(word.toLowerCase(), { count: 0, correct: 0, wrong: 0 });
};
var transformToList = function () {
    var objList = Object.fromEntries(const_1.statka);
    var words = Object.keys(objList).map(function (item) { return const_1.statka.get(item); });
    return words;
};
//    /api/auth
baseRoute.get('/', function (req, res) {
    res.send('<p style="font-size: xxx-large;text-align: center;">Test GET <span style="color: green;">oK</span>!</p>');
});
baseRoute.get('/checkanswer', function (req, res) {
    // word=move&correct=false
    var _a = req.query, word = _a.word, correct = _a.correct;
    if (!const_1.statka.has(word.toLowerCase())) {
        createNewEntry(word);
    }
    if (Number(correct))
        const_1.statka.get(word).correct += 1;
    else
        const_1.statka.get(word).wrong += 1;
    res.status(200);
    res.send('ok');
});
baseRoute.get('/train', function (req, res) {
    console.log('trainBack');
    var word = req.query.word;
    if (!const_1.statka.has(word.toLowerCase())) {
        createNewEntry(word);
    }
    const_1.statka.get(word).count += 1;
    res.status(200);
    res.send('ok');
});
baseRoute.get('/load', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var words;
    return __generator(this, function (_a) {
        words = transformToList();
        res.json(words);
        return [2 /*return*/];
    });
}); });
baseRoute.get('/sort', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var words, _a, sortBy, direction;
    return __generator(this, function (_b) {
        console.log(const_1.statka);
        words = transformToList();
        _a = req.query, sortBy = _a.sortBy, direction = _a.direction;
        if (sortBy === 'word')
            words.sort(function (a, b) { return a.word.localeCompare(b.word); });
        if (sortBy === 'translate')
            words.sort(function (a, b) { return a.translation.localeCompare(b.translation); });
        if (sortBy === 'count')
            words.sort(function (a, b) { return a.count - b.count; }).reverse();
        if (sortBy === 'correct')
            words.sort(function (a, b) { return a.correct - b.correct; }).reverse();
        if (sortBy === 'wrong')
            words.sort(function (a, b) { return a.wrong - b.wrong; }).reverse();
        if (sortBy === 'percent')
            words.sort(function (a, b) {
                var aPercent = (100 / ((a.wrong + a.correct) || 1) * a.correct);
                var bPercent = (100 / ((b.wrong + b.correct) || 1) * b.correct);
                return aPercent - bPercent;
            }).reverse();
        if (direction === 'sort-up')
            words.reverse();
        res.json(words);
        return [2 /*return*/];
    });
}); });
