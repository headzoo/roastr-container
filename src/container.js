'use strict';

const _get = require('lodash.get');

/**
 * A small dependency injection container for node and browsers.
 */
class Container {
    
    /**
     * Constructor
     */
    constructor() {
        this.services  = {};
        this.instances = {};
        this.tags      = {};
    }
    
    /**
     * Returns a service saved in the container
     * 
     * @param {string} key Name of the service
     * @returns {*}
     */
    get(key) {
        let service = this.services[key];
        if (service === undefined) {
            if (key.indexOf('.') !== -1) {
                try {
                    let parts = key.split('.');
                    let key_p = parts.shift();
                    return _get(this.get(key_p), parts.join('.'));
                } catch (e) {
                    throw new Error('Container: Service "' + key + '" not found.');
                }
            }
            
            throw new Error('Container: Service "' + key + '" not found.');
        }
        
        if (this.instances[key] === undefined) {
            if (service.func !== undefined) {
                this.instances[key] = service.func(this);
            }
        } else if (service === false) {
            this.services[key] = true;
        }
        
        return this.instances[key];
    }
    
    /**
     * Saves a value in the container
     * 
     * @param {string}                key       Name of the service
     * @param {Array|string|Function} tags      One or more service tags
     * @param {*}                     [service] The service value
     * @returns {Container}
     */
    set(key, tags, service) {
        if (arguments.length == 2) {
            service = tags;
            tags  = null;
        }
        
        this.services[key]  = false;
        this.instances[key] = service;
        if (tags) {
            this.tagService(key, tags);
        }
        
        return this;
    }
    
    /**
     * Saves a factory service in the container
     * 
     * @param {string}                key    Name of the service
     * @param {Array|string|Function} tags   One or more service tags
     * @param {Function}              [func] The service factory
     * @returns {Container}
     */
    factory(key, tags, func) {
        if (arguments.length == 2) {
            func = tags;
            tags = null;
        }
        
        this.services[key] = {
            func: func
        };
        if (tags) {
            this.tagService(key, tags);
        }
        
        return this;
    }
    
    /**
     * Retrieves services which have been tagged with the give tag
     * 
     * @param {string}   tag        The service tag
     * @param {Function} [callback] Called for each service found matching the tag
     * @returns {Object}
     */
    tagged(tag, callback) {
        if (callback) {
            this.keysByTag(tag).forEach(function(key) {
                callback(this.get(key), key);
            }.bind(this));
            return this;
        }
        
        let values = {};
        this.keysByTag(tag).forEach(function(key) {
            values[key] = this.get(key);
        }.bind(this));
        
        return values;
    }
    
    /**
     * Returns the keys for each value saved in the container
     * 
     * @returns {Array}
     */
    keys() {
        return Object.keys(this.services);
    }
    
    /**
     * Returns the keys for each service tagged with the given tag
     * 
     * @param {string} tag The service tag
     * @returns {*}
     */
    keysByTag(tag) {
        if (this.tags[tag] === undefined) {
            return [];
        }
        
        return this.tags[tag];
    }
    
    /**
     * Associates the given service key with the given service tag
     * 
     * @param {string}       key  Name of the service
     * @param {Array|string} tags The service tag
     * @returns {Container}
     */
    tagService(key, tags) {
        if (!Array.isArray(tags)) {
            tags = [tags];
        }
        tags.forEach(function(tag) {
            if (this.tags[tag] === undefined) {
                this.tags[tag] = [];
            }
            this.tags[tag].push(key);
        }.bind(this));
        
        return this;
    }
}

module.exports = Container;