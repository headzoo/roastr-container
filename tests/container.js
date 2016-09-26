'use strict';

const Container = require('../dist/container');

describe('roastr-container', () => {

    let container;
    
    beforeEach(() => {
        container = new Container();
    });
    
    it('set and get', () => {
        expect(container.set('foo', 'bar')).toEqual(container);
        expect(container.get('foo')).toEqual('bar');
    });
    
    it('factory and get', () => {
        container.factory('foo', function() {
            return 'bar';
        });
        expect(container.get('foo')).toEqual('bar');
    });
    
    it('keys', () => {
        container.set('foo', 'bar');
        container.factory('baz', function() {
            return 'bee';
        });
        expect(container.keys()).toEqual(['foo', 'baz']);
    });
    
    it('tagged objects', () => {
        container.set('foo', ['testing'], 'bar');
        container.set('baz', ['testing'], 'bee');
        container.set('noop', ['testing2'], 'nope');
        container.factory('nice', ['testing2'], function() {
            return 'ice';
        });
        
        expect(container.tagged('testing')).toEqual({
            'foo': 'bar',
            'baz': 'bee'
        });
        expect(container.tagged('testing2')).toEqual({
            'noop': 'nope',
            'nice': 'ice'
        });
    });
    
    it('tagged callback', () => {
        container.set('foo', ['testing'], 'bar');
        container.set('baz', ['testing'], 'bee');
        container.set('noop', ['testing2'], 'nope');
        container.factory('nice', ['testing2'], function() {
            return 'ice';
        });
        
        let services = [];
        container.tagged('testing', function(service) {
            services.push(service);
        });
        expect(services).toEqual(['bar', 'bee']);
        
        services = [];
        container.tagged('testing2', function(service) {
            services.push(service);
        });
        expect(services).toEqual(['nope', 'ice']);
    });
    
    it('tagged keys', () => {
        container.set('foo', ['testing'], 'bar');
        container.set('baz', ['testing'], 'bee');
        container.set('noop', ['testing2'], 'nope');
        container.factory('nice', ['testing2'], function() {
            return 'ice';
        });
        
        expect(container.keysByTag('testing')).toEqual(['foo', 'baz']);
        expect(container.keysByTag('testing2')).toEqual(['noop', 'nice']);
    });
    
    it('expand props', () => {
        container.set('foo', {
            'bar': 'baz'
        });
        expect(container.get('foo.bar')).toEqual('baz');
    });
});